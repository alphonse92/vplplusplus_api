import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/token.errors');
const Token = require(Config.paths.models + "/token/token.mongo");
const UserService = require(Config.paths.services + "/user/user.service");
const Util = require(Config.paths.utils);

class TokenService extends BaseService {

	constructor() {
		super(Token)
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			return await super.listUsingTheRequest(req, {}, { owner: CurrentUser._id })
		} catch (e) {
			throw new Util.Error(Errors.token_doesnt_exist)
		}
	}

	async createUserForToken(CurrentUserWhoCreateTheUser, TokenData) {
		const {
			name,
			description,
			groups = ["default/runner"],
			exp = 0
		} = TokenData

		const newUserData = {
			username: name,
			firstname: name,
			lastname: "Custom Client",
			description: description,
			groups,
		}
		try {
			const UserDoc = await UserService.create(CurrentUserWhoCreateTheUser, newUserData, { exp })
			return UserDoc
		} catch (e) {
			throw new Util.Error(Errors.user_clients_already_exists)
		}
	}


	async create(CurrentUser, TokenData) {
		const { _id: owner } = CurrentUser
		const { exp: tokenExp, name } = TokenData
		const exp = !Number.isNaN(tokenExp) && tokenExp > 0 ? tokenExp : 0
		TokenData.exp = exp


		const UserForClientDoc = await this.createUserForToken(CurrentUser, TokenData)
		TokenData.token = UserForClientDoc.token
		TokenData.user = UserForClientDoc._id
		TokenData.owner = owner
		return super.create(TokenData)
	}

	async delete(CurrentUser, tokenId) {
		const { _id: owner } = CurrentUser
		const query = { owner, _id: tokenId }
		const TokenDocument = await super.delete(query)
		await UserService.delete(CurrentUser, TokenDocument.user)
		return TokenDocument
	}
}

module.exports = new TokenService()