const {PermissionsBitField , Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');

const { SlashCommandBuilder } = require('@discordjs/builders');

const guildid = '' //سيرفر البوت
const token = 'توكنك'
const client = new Client({ intents: 3243773 });
const fs = require(`fs`)
const { readFileSync, writeFileSync } = require(`fs`);
const { Interaction } = require('discord.js-selfbot-v13');
const db = JSON.parse(readFileSync('database.json', 'utf-8'));


const channels = ["" , ""] // تقدر تضيف رومات انك تسوي فاصلة و علامات تنصيص


const commands = [
    new SlashCommandBuilder()
        .setName('open-rooms')
        .setDescription('make the rooms appear'),
    new SlashCommandBuilder()
        .setName('close-rooms')
        .setDescription('make the rooms dis-appear')
]


const rest = new REST({ version: '10' }).setToken(token);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guildid),
            { body: commands.map(command => command.toJSON()) },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'close-rooms') {
        // تأكد من أن العضو لديه الإذن اللازم
        if (!interaction.member.permissions.has('ADMINISTRATOR') && interaction.user.id !== '1126215360002142209') {
            return interaction.reply({ content: 'لا يمكنك استخدام هذا الأمر', ephemeral: true });
        }

        // تعديل أذونات القناة لكل قناة في القائمة
        for (const channelId of channels) {
            const channel = await interaction.guild.channels.cache.get(channelId);
            if (channel) {
                // استبدل 'id_الرول' بالمعرف الحقيقي للرول الذي تريد إخفاء القنوات عنه
                await channel.permissionOverwrites.edit('1234104355599421472', {
                    [PermissionsBitField.Flags.ViewChannel]: false
                });
            }
        }

        // إرسال رد للمستخدم
        await interaction.reply({ content: 'تم غلق الرومات @here', ephemeral: false });
    }else if (interaction.commandName === 'open-rooms'){
        if (!interaction.member.permissions.has('ADMINISTRATOR') && interaction.user.id !== '1126215360002142209') {
            return interaction.reply({ content: 'لا يمكنك استخدام هذا الأمر', ephemeral: true });
        }

        // تعديل أذونات القناة لكل قناة في القائمة
        for (const channelId of channels) {
            const channel = await interaction.guild.channels.cache.get(channelId);
            if (channel) {
                // استبدل 'id_الرول' بالمعرف الحقيقي للرول الذي تريد إخفاء القنوات عنه
                await channel.permissionOverwrites.edit('1234104355599421472', {
                    [PermissionsBitField.Flags.ViewChannel]: true
                });
            }
        }
        await interaction.reply({content :`تم فتح الرومات @here`})
    }
});

client.login(token)