import faker from 'faker'
import { greenMoneyService } from '../../server/services/green_money/greenMoneyService'

export const PARTNER_TYPES = ['Reseller', 'Platform', 'Platform']
export const MERCHANT_TYPES = {
  'E-Commerce': 1,
  Dispensary: 2,
}
export const PASSWORD = 'Abc12345*'

function getSplitRate() {
  return (Math.random() * 5 + 0.1).toFixed(2)
}

function getECommerceBuyRate() {
  return (Math.random() * 5 + 0.1).toFixed(2)
}

function getDispensaryBuyRate() {
  return (Math.random() * 5 + 0.1).toFixed(2)
}

function getServiceRate() {
  return (Math.random() * 5 + 0.1).toFixed(2)
}

function getRandomDigit(min = 0, max = 9) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getNPA() {
  return [getRandomDigit(2), getRandomDigit(), getRandomDigit()].join('')
}

function getNXX() {
  const first = getRandomDigit(2)
  const second = getRandomDigit()
  const thirth = second === 1 ? getRandomDigit(2) : getRandomDigit()
  return [first, second, thirth].join('')
}

function getXXXX() {
  return [
    getRandomDigit(),
    getRandomDigit(),
    getRandomDigit(),
    getRandomDigit(),
  ].join('')
}

function getRandomPhoneNumber() {
  const NPA = getNPA()
  const NXX = getNXX()
  const XXXX = getXXXX()

  return [NPA, NXX, XXXX].join('')
}

const fakerByModel = {
  consumer: () => {
    // const twoToNine = ()Math.ceil(Math.random() * 9) + 2
    return {
      fake: {
        email: faker.internet
          .email()
          .toLowerCase()
          .trim(),
        password: PASSWORD,
        first_name: faker.name.findName(),
        last_name: faker.name.lastName(),
        phone_number: getRandomPhoneNumber(),
      },
    }
  },

  partner: pType => data => {
    const { account } = data

    const { email, account_id } = account

    const partner_type =
      pType && PARTNER_TYPES.includes(pType)
        ? pType
        : PARTNER_TYPES[Math.ceil(Math.random() * PARTNER_TYPES.length - 1)]

    const split_rate = getSplitRate(partner_type)
    const e_commerce_buy_rate = getECommerceBuyRate(partner_type)
    const dispensary_buy_rate = getDispensaryBuyRate(partner_type)
    const partner_payload = {
      account_id,
      email,
      organization: faker.company.companyName(),
      contact_name: `${faker.name.findName()} ${faker.name.lastName()}`,
      partner_type,
      e_commerce_buy_rate,
      split_rate,
      dispensary_buy_rate,
    }
    return { consumer: account, payload: partner_payload }
  },

  merchant: (mType, partners) => (data, index) => {
    // get data from last requests
    const { account: consumer } = data

    const partnerData = partners[index]
    const { partner: partnerInfo } = partnerData
    const { id: partner_id, contact_name } = partnerInfo

    const { email } = consumer

    const nMerchantTypes = Object.keys(MERCHANT_TYPES)
    const ArrayOfMerchantTypes = Object.values(MERCHANT_TYPES)

    const merchant_type = MERCHANT_TYPES[mType]
      ? MERCHANT_TYPES[mType]
      : ArrayOfMerchantTypes[
      Math.ceil(Math.random() * nMerchantTypes.length - 1)
      ]

    const merchantPayload = {
      email,
      merchant_type,
      rdc_enabled: faker.random.boolean(),
      icl_enabled: faker.random.boolean(),
      service_rate: getServiceRate(),
      status: 1,
      billing_dba_name: faker.company.companyName(),
      business_name: faker.company.companyName(),
      support_email: email,
      green_client_id: faker.random.word(),
      green_api_key: faker.random.word(),
      url: faker.internet.url(),
      partners: [{ value: partner_id, name: contact_name }],
      partner_id: partner_id,
    }

    return { consumer, payload: merchantPayload, partner: partnerData }
  },

  contactInfo: ({
    account_id,
    phone_extension = null,
    address_1 = faker.address.streetAddress(),
    address_2 = faker.address.secondaryAddress(),
    city = faker.address.city(),
    state = faker.address.stateAbbr(),
    zip = faker.address.zipCode(),
    country = 'US',
  }) => {
    return {
      account_id,
      phone_extension,
      address_1,
      address_2,
      city,
      state,
      zip,
      country,
    }
  },

  checkbook: ({
    account_id,
    bank_name = faker.company.companyName() + faker.company.companySuffix(),
    bank_routing_number = faker.phone.phoneNumber('#########'),
    bank_account_number = faker.phone.phoneNumber('#########')
  }) => {
    return {
      account_id,
      bank_name,
      bank_account_number,
      bank_routing_number
    }
  },

  payment: (
    { merchant, consumer },
    pStatus = (faker.random.number(4))) => {

    const { merchant_id } = merchant
    const { account_id, consumer_email, } = merchant
    const order_amount = faker.random.number(200)
    const check_id = faker.random.number(10000)
    const check_number = faker.random.number(10000)
    const description = 'This is a Fake Payment'
    const status = greenMoneyService.checkStatus({ Result: '0', VerifyResult: pStatus.toString() })

    return {
      account_id,
      merchant_id,
      order_amount,
      check_id,
      check_number,
      description,
      status,
    }
  },




}

export const create = modelName => fakerByModel[modelName]
