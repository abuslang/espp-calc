# Palo Alto Networks ESPP Calculator

A simple web application to calculate potential gains from Palo Alto Networks' Employee Stock Purchase Plan (ESPP).

## Live Demo
Visit the calculator at: [YOUR_GITHUB_USERNAME.github.io/espp-calc](https://YOUR_GITHUB_USERNAME.github.io/espp-calc)

## Features

- Calculate potential ESPP gains based on:
  - Join date
  - Contribution percentage (1-15%)
  - Annual salary
  - Stock prices
- Automatically determines next offering period
- Shows purchase dates and potential returns
- Accounts for the 15% discount and lookback provision
- Enforces the $25,000 annual limit

## How to Use

1. Enter your Palo Alto Networks join date
2. Select your contribution percentage (1-15%)
3. Enter your annual salary
4. Enter the stock prices for:
   - Offering period start date
   - Expected purchase date
5. Click "Calculate" to see your potential ESPP benefits

## Local Development

To run this calculator locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/espp-calc.git
   ```

2. Open `index.html` in your web browser

No server or build process is required as this is a static website.

## Deployment

This site is hosted using GitHub Pages. To deploy your own version:

1. Fork this repository
2. Go to repository Settings > Pages
3. Set the source branch to `main`
4. Set the folder to `/ (root)`
5. Click Save

Your site will be available at `https://YOUR_GITHUB_USERNAME.github.io/espp-calc`

## Overview

This calculator helps Palo Alto Networks employees estimate their potential gains from participating in the company's ESPP program. By entering your join date, contribution percentage, and annual salary, you can see an estimate of:

- Your next eligible offering period
- Purchase date
- Lookback price
- Current stock price
- Purchase price (with 15% discount)
- Your total contribution
- Number of shares you'll receive
- Market value of those shares
- Potential gain
- Return on investment

## How ESPP Works at Palo Alto Networks

The ESPP program at Palo Alto Networks typically works as follows:

1. Employees can contribute 1-15% of their salary to the ESPP program.
2. Contributions are made through payroll deductions over a 6-month offering period.
3. At the end of the offering period, the contributions are used to purchase Palo Alto Networks stock at a 15% discount.
4. The purchase price is calculated as 85% of the lower of:
   - The stock price at the beginning of the offering period (lookback price)
   - The stock price at the end of the offering period (purchase date price)

## Technical Details

This calculator is a client-side web application built with:
- HTML5
- CSS3
- JavaScript

For the stock price, the calculator currently uses a simulated price. In a production environment, it would connect to a financial API to get real-time stock prices.

## Disclaimer

This calculator provides estimates only. Actual results may vary based on:
- Stock price fluctuations
- Changes in company policy
- Individual tax situations
- Actual offering period dates

Always consult with a financial advisor before making investment decisions. 