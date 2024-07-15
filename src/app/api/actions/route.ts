// ! this is the main file for the blinks that we will make in this case. 

//These are almost all the deoendencies we need for building the Solana Actions in this case
import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, MEMO_PROGRAM_ID, createPostResponse } from "@solana/actions"
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction, } from "@solana/web3.js";

//This is where the main body of the GET requests starts

export const GET = (req: Request) => {

    const payload : ActionGetResponse = {
        icon: new URL("/dash_lottery.png", new URL(req.url).origin).toString(),
        label: "Enter your 3 lottery numbers",
        title: "DASH Lottery",
        description: "Every Friday buy a ticket to win the Jackpot Select for 3 numbers for the Lottery. Enter the numbers between 0 and 20. For example, you could select: 2,14,7",
        links: {
            actions: [
              {
                href: `/api/actions/memo/numbers`,
                label: 'Buy Lottery',
                parameters: [
                  {
                    name: "first_number",
                    label: 'Enter the first number',
                  },
                  {
                    name: "second_numbers",
                    label: 'Enter the second number',
                  },
                  {
                    name: "thrid_number",
                    label: "Enter the thrid number"
                  }
                ],
              },
            ]
    }
}

    return Response.json(payload, {headers: ACTIONS_CORS_HEADERS});  
}

export const OPTIONS = GET;