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

import { ActivityType, Client, GatewayIntentBits, PresenceUpdateStatus } from 'discord.js';
import type { Type } from 'gamedig';
import Gamedig from 'gamedig';
import dotenv from 'dotenv';
import fs from 'fs';

type Config = {
    token: string;
    game: string;
    ip: string;
    port: string;
    delay: string;
    activity: string;
};

// If a .env file exists, load its environment variables
if (fs.existsSync('.env')) { dotenv.config({ path: '.env' }); };

/* Function to set the ActivityType to whatever the user set on the environment variable for the
Activity string, so this will return an actual type instead of a string */
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
    };
};

/* The function that queries the game server the user specified on their environment variables,
and sets their Discord bot's status to the number of current players, number of maximum players
allowed, and the map the server has at the time of the query */
function updateStatus(client: Client, config: any) {
    Gamedig.query({
        type: config['game'] as Type ?? 'tf2',
        host: config['ip'] as string ?? '127.0.0.1',
        port: parseInt(config['port'] as string ?? '27015'),
        givenPortOnly: true
    }).then((stats) => {
        client.user?.setStatus(PresenceUpdateStatus.Online);
        client.user?.setActivity(`${stats.players.length}/${stats.maxplayers} (${stats.map})`, { type: getActivityType(config['activity'] || 'Watching') });
    }).catch((error) => {
        console.error(error)
        client.user?.setStatus(PresenceUpdateStatus.DoNotDisturb);
        client.user?.setActivity(`The server is offline`, { type: getActivityType(config['activity'] || 'Watching') });
    });
};

function generateConfig(index: number): Config {
    return {
      token: process.env[`TOKEN_${index}`] as string,
      game: process.env[`GAME_${index}`] as string,
      ip: process.env[`IP_${index}`] as string,
      port: process.env[`PORT_${index}`] as string,
      delay: process.env[`DELAY_${index}`] as string,
      activity: process.env[`ACTIVITY_${index}`] as string,
    };
};
   
let index = 1;
let configs: Config[] = [];
while (process.env[`TOKEN_${index}`]) {
    configs.push(generateConfig(index));
    index++;
};

configs.forEach((config: Config) => {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user?.tag ?? 'no one?'}`);
        updateStatus(client, config); // Call the function for the first time
        // Call the function every amount of milliseconds the user specified for each bot
        setInterval(() => updateStatus(client, config), parseInt(config['delay'] ?? '30000'));
    });

    void client.login(config.token);
});
