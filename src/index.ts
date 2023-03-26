/*
 * Copyright (C) 2023, Maru Olcese.
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *       https://opensource.org/licenses/BSD-3-Clause
 *
 * or the LICENSE file in the root directory of this source tree.
*/

import { ActivityType, Client, GatewayIntentBits } from 'discord.js'; // Import Discord.JS' typing for Activities, the Client class, and the GatewayIntentBits enum
import type { Type } from 'gamedig'; // Import GameDig's "Type" type for game server types
import Gamedig from 'gamedig'; // Import GameDig for the server queries
import dotenv from 'dotenv'; // Import dotenv for configs
import fs from 'fs';

// Create the bot instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// If a .env file exists, load its environment variables
if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

/* Function to set the ActivityType to whatever the user set on the environment variable for the
Activity string, so this return an actual type instead of a string */
function getActivityType(activityString: string) {
    switch (activityString) {
        case 'Playing':
            return ActivityType.Playing;
        case 'Streaming':
            return ActivityType.Streaming;
        case 'Listening':
            return ActivityType.Listening;
        case 'Watching':
            return ActivityType.Watching;
        case 'Competing':
            return ActivityType.Competing;
        default:
            return ActivityType.Watching;
    }
}

/* The function that queries the game server the user specified on their environment variables,
and sets their Discord bot's status to the number of current players, number of maximum players
allowed, and the map the server has at the time of the query */
function updateStatus(client: Client) {
    Gamedig.query({
        type: process.env['GAME'] as Type ?? 'tf2',
        host: process.env['IP'] as string ?? '127.0.0.1',
        port: parseInt(process.env['PORT'] as string ?? '27015'),
        givenPortOnly: true
    }).then((stats) => {
        client.user?.setActivity(`${stats.players.length}/${stats.maxplayers} (${stats.map})`, { type: getActivityType(process.env['ACTIVITY'] || 'Watching') });
    }).catch((error) => {
        console.error(error)
        client.user?.setActivity(`The server is offline`, { type: getActivityType(process.env['ACTIVITY'] || 'Watching') });
    });
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag ?? 'no one?'}`);
    updateStatus(client); // Call the function for the first time
    /* Call the function every amount of milliseconds the user specified on their environment
    variable */
    setInterval(() => updateStatus(client), parseInt(process.env['DELAY'] ?? '30000'));
});

// Start the bot with the token the user specified on their environment variable
void client.login(process.env['TOKEN'] as string);