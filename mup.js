module.exports = {

	/*
	 https://github.com/kadirahq/meteor-up
	 mup setup
	 mup deploy
	 TODO make sure mongo port is reachable (27017)
	 if auth issues try adding ssh key to ssh-agent
	 */


	servers: {
		one: {
			host: '52.63.79.81',
			username: 'ubuntu',
			pem: "/Users/danielwild/GoogleDrive/aws/keys/danwild-aws-sydney.pem",
			opts: {
				port: 22
			}
		}
	},

	meteor: {
		name: 'stemaustralia',
		path: "/Users/danielwild/GoogleDrive/Git/stem-australia",

		servers: {
			one: {}
		},
		buildOptions: {
			serverOnly: true,
			debug: true,
			cleanAfterBuild: true // default
		},
		env: {
			ROOT_URL: 'http://52.63.79.81',
			MONGO_URL: 'mongodb://localhost/stemaustralia'
		},

		deployCheckWaitTime: 50 //default 10
	},

	mongo: {
		oplog: true,
		port: 27017,
		servers: {
			one: {}
		}
	}

};
