export class OnLoginSuccess {
	static readonly type = '[UserSession] Create session';
	constructor (public username: string, public sessionId: string, public userId: string) { }
}

export class Logout {
	static readonly type = '[UserSession] Logout';
	constructor () { }
}

export class OnLogoutSuccess {
	static readonly type = '[UserSession] Logout success';
	constructor () { }
}

export class Login {
	static readonly type = '[UserSession] Login';
	constructor (public username: string, public password: string) { }
}
export class Register {
	static readonly type = '[UserSession] Register';
	constructor (public userDto: {
		email: string;
		password: string;
		confirmPassword: string;
	}) { }
}
