// ! this is the main file for the blinks that we will make in this case. 

//These are almost all the deoendencies we need for building the Solana Actions in this case
import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, MEMO_PROGRAM_ID, createPostResponse } from "@solana/actions"
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction, } from "@solana/web3.js";

//This is where the main body of the GET requests starts

export const GET = (req: Request) => {

    const payload : ActionGetResponse = {
        icon: new URL("/debridge.jpeg", new URL(req.url).origin).toString(),
        label: "Enter the amount you want to bridge from sol to eth",
        title: "DEBRIDGE SOL TO ETH",
        description: "Connect your Wallet, then type the amount that you want to bridge. After this the final step is to paste the ethereum address and click on the bridge button. ",
        links: {
            actions: [
              {
                href: `/api/actions/bridge`,
                label: 'Bridge Assets',
                parameters: [
                    {
                        name: "bridge",
                        label: "Enter the amount that you want to bridge"
                      },
                  {
                    name: "ethereum_address",
                    label: 'Enter your Ethereum Address',
                  },
                  
                ],
              },
            ]
    }
}

    return Response.json(payload, {headers: ACTIONS_CORS_HEADERS});  
}

export const OPTIONS = GET;

//This is where the post request for the action is being executed
export const POST = async (req: Request) => {
  try {
      const body: ActionPostRequest = await req.json();

      let account: PublicKey;
      try{
          account = new PublicKey(body.account);
      } catch(err) {
          return new Response("Invalid account provided", {
              status: 400,
              headers: ACTIONS_CORS_HEADERS,
          })
      }

      const transaction = new Transaction();

      transaction.add(

          ComputeBudgetProgram.setComputeUnitPrice({
              microLamports: 1000,
          }),
          new TransactionInstruction({
              programId: new PublicKey(MEMO_PROGRAM_ID),
              data: Buffer.from("this is a simple memo message", "utf8"),
              keys: []
          })
      );

      transaction.feePayer = account;

      const connection = new Connection(clusterApiUrl("devnet"));
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const payload: ActionPostResponse = await createPostResponse({
          fields: {
              transaction,
          },
      })

      return Response.json(payload, { headers: ACTIONS_CORS_HEADERS});
  } catch (err) {
      return Response.json("An unknown error has occured", {status: 400})
  }
}