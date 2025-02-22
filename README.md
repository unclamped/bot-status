# bot-status
A Discord.JS bot that displays information about a game server on its status

![image](https://user-images.githubusercontent.com/104658278/227810439-986ca705-d698-4e3e-8ebe-6b5021f8d33f.png)

## Installation

- Running the bot directly in the host machine:
    1. Install [Node.JS](https://nodejs.org/en/download/)
    2. Install [pnpm](https://pnpm.io/installation)
    3. Clone this repository with `git clone https://github.com/unclamped/bot-status.git`
    4. `cd` into the cloned repository
    5. Install the dependencies with `pnpm install`
    6. Build the bot with `pnpm build`
    7. Run the bot with `pnpm start`

- Running the bot with Docker:
    1. Install [Docker](https://docs.docker.com/get-docker/)
    2. **Option 1: Using the DockerHub image**
        1. Download the `docker-compose.yaml` file from the repository
        2. Run the container with `docker compose up -d`
    3. **Option 2: Building the image yourself**
        1. Clone this repository with `git clone https://github.com/unclamped/bot-status.git`
        2. Change the docker-compose.yaml to comment the `image` line and uncomment the `build` section
        3. Build the image with `docker compose build`
        4. Run the container with `docker compose up -d`

## Configuration

1. Rename the `.env.sample` file to `.env`
2. Modify the `.env` file to your needs
- This applies for both Docker and non-Docker installations, since Docker automatically parses `.env` files
If you want to run more than one bot at once, you should add each bot's settings, with their variable name followed by a _ and the number that follows the previous bot setting.

### Settings

- Available settings:
    - `TOKEN`: The bot's Discord token
        - You can get a token by creating a new application on the [Discord Developer Portal](https://discord.com/developers/applications)
    - `IP`: The game server's IP address or hostname (e.g. `tf.servilive.cl`)
    - `PORT`: The game server's port (e.g. `27015`)
    - `DELAY` The delay between each status update in milliseconds (e.g. `15000`)
        - Discord has a rate limit of 5 status updates per minute, so you should not set this value below 12000
    - `GAME` The game the server corresponds to (e.g. `minecraft`)
        - You can find the full list on the [GameDig README](https://github.com/gamedig/node-gamedig#games-list)
    - `ACTIVITY`: The activity the bot should display (e.g. `Playing`)
        - Available values: `Playing`, `Streaming`, `Listening`, `Watching`, `Competing`

## Usage

If you installed the bot directly in the host machine, you can run it with `pnpm start`. Or else, if you installed it with Docker, you can do the same with `docker compose up -d`.

## License

This software is licensed under the `New BSD License`. See the ``LICENSE`` file in the top distribution directory for the full license text.
