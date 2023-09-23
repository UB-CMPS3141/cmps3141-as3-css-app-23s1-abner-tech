// Vue.js code
import { createApp } from "https://mavue.mavo.io/mavue.js";

globalThis.app = createApp({
    data: {
        expenses: [], // Store the loaded expenses data
        transactionType: 'jointExpense',
        paymentType: 'personalPayment',
        Date:'',
        amount: 0,
        payer: 'Neo',
        convertedAmount: 0.00,
        toCurrency:'BZD',
        CURRENCY: 'BZD',


    },


    methods: {
        /**
         * Currency convert function stub.
         * In a real app, you would use an API to get the latest exchange rates,
         * and we'd need to support all currency codes, not just MXN, BZD, and GTQ.
         * However, for the purposes of this assignment, let's assume they travel nearby, so this is fine.
         * @param {"MXN" | "BZD" | "GTQ"} from - Currency code to convert from
         * @param {"MXN" | "BZD" | "GTQ"} to - Currency code to convert to
         * @param {number} amount - Amount to convert
         * @returns {number} Converted amount
         */
        currencyConvert(from, to, amount) {
            const rates = {
                BZD: 1,
                MXN: 8.73,
                GTQ: 3.91
            };



            return amount * rates[to] / rates[from];
        },

        convertCurrency() {
            const amount = parseFloat(this.amount);

            if(this.toCurrency === 'BZD'){
                this.convertedAmount = this.amount;
                this.CURRENCY = this.toCurrency;
            } else if(this.toCurrency === 'MXN'){
                this.convertedAmount = this.currencyConvert(this.toCurrency,'BZD',amount).toFixed(2);
                this.CURRENCY = this.toCurrency;
            }
            else{
                this.convertedAmount =  this.currencyConvert(this.toCurrency,'BZD',amount).toFixed(2);
                this.CURRENCY = this.toCurrency;
            };
        },

    
        async Add_Transaction() {
            // Add your transaction logic here

     


            const title = this.transactionType;
            const amount = parseFloat(this.amount);

            const newTransaction = {
                title: title,
            };

            //this.expenses.push(newTransaction);

            try{
                const response = await fetch('https://raw.githubusercontent.com/abner-tech/JsonFileForExpenseApp/main/data.json',
                // const response = await fetch('https://raw.githubusercontent.com/UB-CMPS3141/cmps3141-as3-css-app-23s1-abner-tech/main/expenses/data.json',
                {
                    method: 'PUSH',
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(this.expenses)
                });

                if(!response.ok){
                    throw new Error('Failed to update data.json');
                }

                this.transactionType = 'jointExpense';
                this.paymentType = 'personalPayment';
                this.Date = '';
                this.amount = 0;
                this.payer = 'Neo';

            } catch(error){
                console.error('error adding transaction', error);
            }

        },

    },

    mounted() {
        // Load the expenses data from the JSON file
        //fetch('https://raw.githubusercontent.com/UB-CMPS3141/cmps3141-as3-css-app-23s1-abner-tech/main/expenses/data.json')
        fetch('https://raw.githubusercontent.com/abner-tech/JsonFileForExpenseApp/main/data.json')
            .then(response => response.json())
            .then(data => {
                this.expenses = data;
            })
            .catch(error => console.error('Error fetching data:', error));
    },

    computed: {
        total_balance() {
            // Calculate the total balance
            let total = 0;

            for (const expense of this.expenses) {
                let trinity_paid = expense.trinity_paid ?? 0;
                let neo_paid = expense.neo_paid ?? 0;
                let trinity_paid_for_neo = expense.trinity_paid_for_neo ?? 0;
                let neo_paid_for_trinity = expense.neo_paid_for_trinity ?? 0;

                total += (trinity_paid - neo_paid) / 2 + trinity_paid_for_neo - neo_paid_for_trinity;
            }
            return total;
        },

        debtSummary() {
            const summary={
				Neo: 0,
				Trinity:0
			};

			for(const expense of this.expenses){
				const trinity_paid = expense.trinity_paid || 0;
				const neo_paid = expense.neo_paid || 0;
				const trinity_paid_for_neo = expense.trinity_paid_for_neo || 0;
				const neo_paid_for_trinity = expense.neo_paid_for_trinity || 0;


				const neo_paid_total = neo_paid + neo_paid_for_trinity;
				const trinity_paid_total = trinity_paid + trinity_paid_for_neo;

				summary.Neo += trinity_paid_total - neo_paid_total;
				summary.Trinity += neo_paid_total - trinity_paid_total;
			}
			// console.log(summary);
			this.total_balance;
			return summary;
			

        },

        transactionHistory() {
            // Initialize an empty array to store transaction history entries
            const history = [];

            // Iterate through expenses and generate transaction history entries
            for (const expense of this.expenses) {
                const title = expense.title;
                const trinityPaid = expense.trinity_paid || 0;
                const neoPaid = expense.neo_paid || 0;
                const payer = trinityPaid > neoPaid ? 'Trinity' : 'Neo';
                const amount = "$" + Math.abs(trinityPaid - neoPaid).toFixed(2);

                // Create a transaction history entry and add it to the array
                const transactionEntry = `${title}: ${amount}, Paid by: ${payer}`;
                history.push(transactionEntry);
            }


            return history;
        }
    }
}, "#app");
