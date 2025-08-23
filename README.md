# LinkedIn JavaScript Tips Poster

This project automates the posting of JavaScript and React tips to LinkedIn on a daily basis. It utilizes Node.js and various libraries to handle scheduling and API interactions.

## Project Structure

```
linkedin-js-tips-poster
├── src
│   ├── index.js                # Entry point of the application
│   ├── config
│   │   └── config.js           # Configuration settings
│   ├── data
│   │   ├── javascriptTips.json  # 100 JavaScript tips
│   │   └── reactTips.json       # 100 React tips
│   ├── services
│   │   ├── linkedinService.js    # Service for LinkedIn API interactions
│   │   └── schedulerService.js    # Service for scheduling posts
│   └── utils
│       ├── logger.js            # Logging utility
│       └── helpers.js           # Helper functions
├── .env.example                 # Example environment variables
├── .gitignore                   # Files to ignore in Git
├── package.json                 # NPM configuration file
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd linkedin-js-tips-poster
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values, including LinkedIn API credentials.

4. **Run the application:**
   ```
   node src/index.js
   ```

## Usage

The application will automatically post a random JavaScript or React tip to LinkedIn every day. You can modify the tips in the `src/data/javascriptTips.json` and `src/data/reactTips.json` files as needed.

## Contributing

Feel free to submit issues or pull requests for improvements or additional features.