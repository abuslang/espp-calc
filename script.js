document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const joinDateInput = document.getElementById('joinDate');
    const contributionPercentInput = document.getElementById('contributionPercent');
    const salaryInput = document.getElementById('salary');
    const offeringPriceInput = document.getElementById('offeringPrice');
    const purchasePriceInput = document.getElementById('purchasePrice');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Result elements
    const nextOfferingValue = document.getElementById('nextOfferingValue');
    const purchaseDateValue = document.getElementById('purchaseDateValue');
    const lookbackPriceValue = document.getElementById('lookbackPriceValue');
    const currentPriceValue = document.getElementById('currentPriceValue');
    const purchasePriceValue = document.getElementById('purchasePriceValue');
    const contributionValue = document.getElementById('contributionValue');
    const sharesReceivedValue = document.getElementById('sharesReceivedValue');
    const marketValueValue = document.getElementById('marketValueValue');
    const potentialGainValue = document.getElementById('potentialGainValue');
    const percentageReturnValue = document.getElementById('percentageReturnValue');

    // Get label elements for stock prices
    const offeringPriceLabel = document.querySelector('label[for="offeringPrice"]');
    const purchasePriceLabel = document.querySelector('label[for="purchasePrice"]');
    
    // Add event listeners
    joinDateInput.addEventListener('change', updateOfferingPeriod);
    calculateBtn.addEventListener('click', calculateESPP);

    // Function to format dates
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Function to get next trading day if date falls on weekend
    function getNextTradingDay(date) {
        const day = date.getDay();
        if (day === 6) { // Saturday
            date.setDate(date.getDate() + 2);
        } else if (day === 0) { // Sunday
            date.setDate(date.getDate() + 1);
        }
        return date;
    }

    // Function to get offering period start date
    function getOfferingStartDate(year, month) {
        let date = new Date(year, month, month === 1 ? 28 : 31); // Feb 28 or Aug 31
        return getNextTradingDay(date);
    }

    // Function to get next offering period
    function getNextOfferingPeriod(joinDate) {
        const today = new Date();
        const currentYear = today.getFullYear();
        
        // Define next possible offering periods (looking ahead 2 years)
        const offeringStarts = [];
        for (let year = currentYear - 1; year <= currentYear + 1; year++) {
            // February 28th offering
            offeringStarts.push({
                start: getOfferingStartDate(year, 1), // February
                end: getOfferingStartDate(year + 2, 1) // February 2 years later
            });
            
            // August 31st offering
            offeringStarts.push({
                start: getOfferingStartDate(year, 7), // August
                end: getOfferingStartDate(year + 2, 7) // August 2 years later
            });
        }
        
        // Sort offering periods by start date
        offeringStarts.sort((a, b) => a.start - b.start);
        
        // Find the next valid offering period based on join date
        const validOffering = offeringStarts.find(period => 
            period.start > joinDate && period.start >= today
        );
        
        if (!validOffering) return null;
        
        // Calculate purchase dates for this offering period
        const purchaseDates = [];
        let currentDate = new Date(validOffering.start);
        
        // Add 4 purchase dates (6 months apart)
        for (let i = 0; i < 4; i++) {
            let purchaseDate = new Date(currentDate);
            purchaseDate.setMonth(purchaseDate.getMonth() + 6);
            purchaseDates.push(getNextTradingDay(purchaseDate));
            currentDate = purchaseDate;
        }
        
        return {
            start: validOffering.start,
            end: validOffering.end,
            purchaseDates: purchaseDates
        };
    }

    // Function to determine and display next offering period
    function updateOfferingPeriod() {
        const joinDate = new Date(joinDateInput.value);
        if (isNaN(joinDate.getTime())) return;

        const period = getNextOfferingPeriod(joinDate);
        if (!period) return;

        // Update the offering period display
        nextOfferingValue.textContent = `${formatDate(period.start)} to ${formatDate(period.end)}`;

        // Update the stock price input labels
        offeringPriceLabel.textContent = `Stock price at offering start (USD) (${formatDate(period.start)}):`;
        purchasePriceLabel.textContent = `Expected stock price at purchase (USD) (${formatDate(period.purchaseDates[0])}):`;
    }
    
    // Function to calculate ESPP benefits
    function calculateESPP() {
        // Get input values
        const joinDate = new Date(joinDateInput.value);
        const contributionPercent = parseFloat(contributionPercentInput.value);
        const annualSalary = parseFloat(salaryInput.value);
        const offeringPrice = parseFloat(offeringPriceInput.value);
        const expectedPurchasePrice = parseFloat(purchasePriceInput.value);
        
        // Validate inputs
        if (isNaN(joinDate.getTime())) {
            alert('Please enter a valid join date');
            return;
        }
        
        if (isNaN(contributionPercent) || contributionPercent < 1 || contributionPercent > 15) {
            alert('Contribution percentage must be between 1% and 15%');
            return;
        }
        
        if (isNaN(annualSalary) || annualSalary <= 0) {
            alert('Please enter a valid annual salary');
            return;
        }

        if (isNaN(offeringPrice) || offeringPrice <= 0) {
            alert('Please enter a valid offering price');
            return;
        }

        if (isNaN(expectedPurchasePrice) || expectedPurchasePrice <= 0) {
            alert('Please enter a valid purchase price');
            return;
        }

        const period = getNextOfferingPeriod(joinDate);
        if (!period) {
            alert('Could not determine offering period');
            return;
        }
        
        // Calculate ESPP details
        const esppDetails = calculateESPPDetails(
            joinDate, 
            contributionPercent, 
            annualSalary, 
            offeringPrice,
            expectedPurchasePrice,
            period
        );
        
        // Display results
        displayResults(esppDetails);
    }
    
    // Function to calculate ESPP details based on join date
    function calculateESPPDetails(joinDate, contributionPercent, annualSalary, offeringPrice, currentPrice, period) {
        // Calculate purchase price (15% discount off the lower of lookback or current price)
        const lowerPrice = Math.min(offeringPrice, currentPrice);
        const discountedPurchasePrice = lowerPrice * 0.85;
        
        // Calculate contribution amount (6-month period)
        const sixMonthSalary = annualSalary / 2;
        const contributionAmount = sixMonthSalary * (contributionPercent / 100);
        
        // Check $25,000 annual limit
        const annualLimit = 25000;
        const maxSharesPerYear = Math.floor(annualLimit / offeringPrice);
        
        // Calculate shares received (rounded down to nearest whole share)
        let sharesReceived = Math.floor(contributionAmount / discountedPurchasePrice);
        
        // Apply annual limit if necessary
        if (sharesReceived > maxSharesPerYear) {
            sharesReceived = maxSharesPerYear;
        }
        
        // Calculate market value of shares at current price
        const marketValue = sharesReceived * currentPrice;
        
        // Calculate actual contribution based on shares received
        const actualContribution = sharesReceived * discountedPurchasePrice;
        
        // Calculate potential gain
        const potentialGain = marketValue - actualContribution;
        
        // Calculate percentage return
        const percentageReturn = (potentialGain / actualContribution) * 100;
        
        return {
            nextOfferingPeriod: {
                start: period.start,
                end: period.end
            },
            purchaseDate: period.purchaseDates[0],
            lookbackPrice: offeringPrice,
            currentPrice: currentPrice,
            purchasePrice: discountedPurchasePrice,
            contributionAmount: actualContribution,
            sharesReceived: sharesReceived,
            marketValue: marketValue,
            potentialGain: potentialGain,
            percentageReturn: percentageReturn
        };
    }
    
    // Function to display results
    function displayResults(esppDetails) {
        // Format dates
        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
        
        // Format currency
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        };
        
        // Format percentage
        const formatPercentage = (percent) => {
            return new Intl.NumberFormat('en-US', {
                style: 'percent',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(percent / 100);
        };
        
        // Update result elements
        nextOfferingValue.textContent = `${formatDate(esppDetails.nextOfferingPeriod.start)} to ${formatDate(esppDetails.nextOfferingPeriod.end)}`;
        purchaseDateValue.textContent = formatDate(esppDetails.purchaseDate);
        lookbackPriceValue.textContent = formatCurrency(esppDetails.lookbackPrice);
        currentPriceValue.textContent = formatCurrency(esppDetails.currentPrice);
        purchasePriceValue.textContent = formatCurrency(esppDetails.purchasePrice);
        contributionValue.textContent = formatCurrency(esppDetails.contributionAmount);
        sharesReceivedValue.textContent = esppDetails.sharesReceived.toFixed(0);
        marketValueValue.textContent = formatCurrency(esppDetails.marketValue);
        potentialGainValue.textContent = formatCurrency(esppDetails.potentialGain);
        percentageReturnValue.textContent = formatPercentage(esppDetails.percentageReturn);
    }
}); 