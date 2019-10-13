import chalk from 'chalk'
import request from 'request-promise-native'

import knexConfig from '../../knexfile'
import { create as createFake, PASSWORD } from './faker'
import { contactInfoModel, checkbookModel } from '../../server/models'
// import {  paymentModel } from '../../server/models'
import { payments } from '../../server/database'

const API_DOWN_CODE = 'ECONNREFUSED'

export class Cli {
  constructor(
    URL,
    PORT,
    ASYNC,
    SESSION,
    USER = 'devtest+admin@zodaka.com',
    PASSWORD = 'abc12345'
  ) {
    Object.assign(this, { URL, PORT, SESSION, ASYNC })
    this.sessionPromise = SESSION
      ? Promise.resolve({ token: SESSION })
      : this.getRequest(undefined, 'accounts/login', {
          login_identifier: USER,
          password: PASSWORD,
        }).then(data => data.response)
  }

  getBaseUrl() {
    return `http://${this.URL}:${this.PORT}/api`
  }

  getUrl(resource) {
    const base = `${this.getBaseUrl()}`
    const url = `${base}/${resource}`
    return url
  }

  async getAuthRequest(resource, body, OPTS) {
    const session = await this.sessionPromise
    this.TOKEN = session.token
    return this.getRequest(session.token, resource, body, OPTS)
  }

  getRequest(token, resource, body, OPTS) {
    const authorization = token ? `Bearer ${token}` : undefined
    const uri = this.getUrl(resource)
    const options = {
      uri,
      body,
      method: 'POST',
      headers: { authorization },
      json: true,
      ...OPTS,
    }
    return request(options).then(response => ({ response, body }))
  }

  createRequestForConsumer = async data => {
    return this.getAuthRequest('admin/create-account', data).then(
      ({ response }) => ({
        account: { ...data, ...response, id: response.account_id },
      })
    )
  }

  async createConsumers(amount) {
    if (!amount) return []

    const ArrayOfPromisesForCreateConsumers = new Array(amount)
      .fill(undefined)
      .map(createFake('consumer'))
      .map(flowData =>
        // we cant use async/await so, we need handle the promises manually
        this.createRequestForConsumer(flowData.fake)
          .then(this.createContactInfo)
          .then(this.createCheckbook)
      )

    return Promise.all(ArrayOfPromisesForCreateConsumers)
  }

  createContactInfo(user) {
    const { account } = user
    const { account_id, email } = account

    return contactInfoModel
      .createContactInfo(createFake('contactInfo')({ account_id, email }))
      .then(data => {
        return { ...user, contactInfo: data }
      })
  }

  createCheckbook(user) {
    const { account } = user
    const { account_id } = account

    return checkbookModel
      .createCheckbook(createFake('checkbook')({ account_id }))
      .then(checkbook => {
        return { ...user, checkbook }
      })
  }

  createRequestForPartner = async data => {
    return this.getAuthRequest('admin/promote-partner', data)
  }

  async createPartners(amount, pType) {
    if (!amount) return []

    const consumers = await this.createConsumers(amount)
    const ArrayOfPromisesForCreatePartners = consumers
      .map(createFake('partner')(pType))
      .map(({ payload, consumer }) =>
        this.createRequestForPartner(payload).then(({ response }) => ({
          consumer,
          partner: { ...payload, ...response, id: response.partner_id },
          isPartner: true,
        }))
      )
    return Promise.all(ArrayOfPromisesForCreatePartners)
  }

  createRequestForMerchant = async data => {
    return this.getAuthRequest('admin/promote-merchant', data)
  }

  async createMerchants(amount, mType) {
    if (!amount) return []

    let consumersForMerchants = [],
      partners = []

    if (this.ASYNC) {
      // i could create the consumers for the nmerchants and the partners
      // in the same time, but it will fill the knex pool

      const lote = await Promise.all([
        this.createConsumers(amount),
        this.createPartners(amount),
      ])
      consumersForMerchants = lote[0]
      partners = lote[1]
    } else {
      consumersForMerchants = await this.createConsumers(amount)
      partners = await this.createPartners(amount)
    }

    const ArrayOfPromisesForCreateMerchants = consumersForMerchants
      .map(createFake('merchant')(mType, partners))
      .map(({ payload, consumer, partner }) =>
        this.createRequestForMerchant(payload).then(({ response }) => ({
          consumer,
          partner,
          merchant: { ...payload, ...response, id: response.merchant_id },
          isMerchant: true,
        }))
      )

    return Promise.all(ArrayOfPromisesForCreateMerchants)
  }

  log(title = '', msg = '') {
    console.log(chalk.yellow(title), msg)
  }

  printWarnings(opts) {
    const { consumer = 0, partner = 0, merchant = 0, payment } = opts
    const dbConfig = knexConfig[process.env.NODE_ENV || 'development']
    const { pool } = dbConfig
    const { max: maxPool } = pool

    const maxPoolExceeded =
      consumer > maxPool || partner > maxPool || merchant > maxPool

    this.log()

    const consumersWillBeCreatedDueToPaymentsCreation = payment && !consumer
    const merchantsWillBeCreatedDueToPaymentsCreation = payment && !merchant

    if (maxPoolExceeded)
      this.log(
        'Warning',
        'You are trying to create more than ' +
          maxPool +
          ' users. It could throw an exception, please increase the max pool  (' +
          maxPool +
          ' current) connections in the knexfile.js \n'
      )
    if (consumersWillBeCreatedDueToPaymentsCreation)
      this.log(
        'Info',
        'You are trying to create payments without create consumers before. The consumers will be created'
      )
    if (merchantsWillBeCreatedDueToPaymentsCreation)
      this.log(
        'Info',
        'You are trying to create payments without create merchants before. The merchants will be created'
      )
  }

  getRandomMerchantCreated(merchants) {
    // stop randomize
    if (merchants.length === 1) return merchants[0].merchant

    const nMerchants = merchants.length
    const randomIndex = Math.ceil(Math.random() * nMerchants)
    const { merchant } = merchants[randomIndex - 1]
    return merchant
  }

  getRandomConsumerCredated(consumers) {
    // stop randomize
    if (consumers.length === 1) return consumers[0].account

    const nConsumers = consumers.length
    const randomIndex = Math.ceil(Math.random() * nConsumers)
    const { account } = consumers[randomIndex - 1]

    return account
  }

  createRequestForPayments = async data => {
    return this.getAuthRequest('payments', data).then(({ response }) => ({
      payment: { ...data, ...response },
    }))
  }

  createPayments(amount, merchants, consumers, pStatus) {
    const arrayOfRequests = new Array(amount).fill(undefined).map(() => {
      const consumer = this.getRandomConsumerCredated(consumers)
      const merchant = this.getRandomMerchantCreated(merchants)
      return payments.commands.create(
        createFake('payment')({ merchant, consumer }, pStatus)
      )
    })

    return Promise.all(arrayOfRequests)
  }

  create = async opts => {
    this.printWarnings(opts)

    let {
      consumer = 0,
      partner = 0,
      merchant = 0,
      payment = 0,
      partnerType,
      merchantType,
      paymentStatus,
      paymentMerchantId,
      paymentConsumerId,
      output,
      all = 0,
    } = opts

    let consumers = [],
      partners = [],
      merchants = [],
      payments = [],
      data

    if (all) consumer = partner = merchant = all

    if (payment && !consumer) consumer = payment
    if (payment && !merchant) merchant = payment

    try {
      if (consumer) {
        consumers = await this.createConsumers(+consumer)
        this.log('Consumers Created:', consumers.length)
      }

      if (partner) {
        partners = await this.createPartners(+partner, partnerType)
        this.log('Partners Created:', partners.length)
      }

      if (merchant) {
        merchants = await this.createMerchants(+merchant, merchantType)
        this.log('Merchants Created:', merchants.length)
      }

      if (payment) {
        const merchantsFiltered = paymentMerchantId
          ? merchants.find(
              ({ merchant }) => merchant.merchant_id === paymentMerchantId
            )
          : merchants

        const consumersFiltered = paymentConsumerId
          ? consumers.find(
              ({ account }) => account.account_id === paymentConsumerId
            )
          : consumers

        payments = await this.createPayments(
          +payment,
          merchantsFiltered,
          consumersFiltered,
          paymentStatus
        )

        this.log('Payments Created:', payments.length)
      }

      if (consumer || partner || merchant) {
        this.log('Password for consumers: ', PASSWORD + '\n')
      }
    } catch (e) {
      if (e.cause && e.cause.code === API_DOWN_CODE)
        this.log('Info:', `API is down ${this.getBaseUrl()} \n`)
      else console.log(e)
    } finally {
      data = { consumers, merchants, partners, payments }

      if (output || output === 'true')
        console.log(
          '\n\n',
          chalk.yellow('Bearer ') + chalk.whiteBright(this.TOKEN),
          '\n\n',
          chalk.blue('OUTPUT START ==============='),
          '\n\n',
          JSON.stringify(data, null, 2),
          '\n\n',
          chalk.blue('OUTPUT END ===============')
        )
    }

    return data
  }
}
