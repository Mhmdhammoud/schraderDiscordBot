/* eslint-disable linebreak-style */
// require the discord.js module

const Discord = require('discord.js');

const { prefix, token } = require('./config.json');

// create a new Discord client

const client = new Discord.Client();

const firstBatchCommands = require('./command/test');

client.commands = new Discord.Collection();

client.commands.set(firstBatchCommands.name, firstBatchCommands);

// when the client is ready, run this code

// this event will only trigger one time after logging in

client.once('ready', () => {
	console.log('Boop beep, beep boop!');
});

// login to Discord witprh your app's toke\n

client.login(token);

const getUserFromMention = (mention) => {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith(`${prefix}`)) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
};

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	if (message.content.startsWith(`${prefix}server`)) {
		return message.channel

			.send(
				`Server name: ${message.guild.name}

			\n Total number of members: ${message.guild.memberCount}

			\n Server region: ${message.guild.region} 

			\n Created at: ${message.guild.createdAt}`
			)

			.catch((err) => {
				console.error(err);
			});
	} else if (message.content === `${prefix}`) {
		message

			.reply(
				`You need to add an argument after your prefix. For example: ${prefix}server `
			)

			.catch((err) => console.error(err));
	}

	// split the args from the prefix

	const args = message.content.slice(prefix.length).trim().split(' ');

	// Move the commands alone with lowercase transformation

	const command = args.shift().toLowerCase();
	let user;
	if (!args.length) {
		return message.reply(`You didn't provide any arguments, ${message.author}!`);
	} else if (command === 'warn') {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to warn them!');
		} else {
			user = getUserFromMention(args[0]);

			if (!user) {
				message.reply('Please choose a valid user in order to warn him');
			} else {
				return message.channel.send(
					`<@${user.id}>\n ${message.author.username} wants to warn you`
				);
			}
		}
	} else if (command === 'prune') {
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			message.channel.bulkDelete(1);

			return message.reply(`${args[0]}that doesnt seem to be a valid number.`);
		} else if (amount <= 1 || amount > 100) {
			return message.reply('Choose a number between 1 and 99!');
		} else {
			message.channel

				.bulkDelete(amount, true)

				.catch((err) => console.error(err.message));
		}
	} else if (command === 'user-info') {
		user = getUserFromMention(args[0]);
		console.log(args[0]);

		if (!user) {
			return message.channel.send('Please tag someone to check his user info');
		} else {
			message.reply(`User Created At ${message.mentions.users[0]}`);
			console.log(user.id);
		}
	}
});
