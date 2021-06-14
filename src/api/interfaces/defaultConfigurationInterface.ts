export interface DefaultConfigurationInterface {
	appName: string,
	version: string,
	port: number,
	defaultLang: string,
	contact: {
		mailAddress: string,
		mailPassword: string,
		mailHost: string,
		hostPort: string
	}
}