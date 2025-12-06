const { REST, Routes, SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType } = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
// --- MODIFIED: Hardcoded your Client ID as requested ---
const clientId = '1424632133909090355';

if (!token || !clientId) {
    console.error('Error: DISCORD_TOKEN and clientId must be set.');
    process.exit(1);
}

const commands = [
    new SlashCommandBuilder()
        .setName('barg')
        .setDescription('Sends a prompt to the OpenRouter LLM.')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The prompt you want to send to the model.')
                .setRequired(true))
        .setIntegrationTypes([
            ApplicationIntegrationType.GuildInstall,
            ApplicationIntegrationType.UserInstall
        ])
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ]),
    new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Clears your conversation history with the bot.')
        .setIntegrationTypes([
            ApplicationIntegrationType.GuildInstall,
            ApplicationIntegrationType.UserInstall
        ])
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error deploying commands:', error.rawError || error.message);
        console.error(error);
    }
})();

