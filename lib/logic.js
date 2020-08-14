
/**
 * Track the trade of a luc from one trader to another
 * @param {org.london.luc.Trade} trade - the trade to be processed
 * @transaction
 */
async function tradeCoin(trade) {

    let assetRegistry = await getAssetRegistry('org.london.luc.Coin');

    	//Create new coins
      const factory = getFactory();
      const addCoin = factory.newResource('org.london.luc', 'Coin', 'COIN_' + Date.now());
      const removeCoin = factory.newResource('org.london.luc', 'Coin', 'COIN_' + (Date.now()+1));
      //Update coin for new user
      addCoin.quantity = trade.amount;//Set quantity
      addCoin.owner = trade.newOwner;//Set user
      //Update "anti-coin" for old user
      removeCoin.quantity = -trade.amount;//Set quantity
      removeCoin.owner = trade.oldOwner;//Set user

    // persist the state of the luc
    await assetRegistry.add(addCoin);//Add coins to registry.
    await assetRegistry.add(removeCoin);
}

/**
 * Awards coins to a user based on their consumption.
 * @param {org.london.luc.AwardCoin} award
 * @transaction
 */
async function awardCoins(award) {

    //Get registry of particpants
    let participantRegistry = await getParticipantRegistry('org.london.luc.User');
  	let coinRegistry = await getAssetRegistry('org.london.luc.Coin');
  	let WhtoLUCRegistry = await getAssetRegistry('org.london.luc.WhtoLUC');
 
  	const user = award.owner;//Get the new owner of the coins
	const averageConsumption = await getAverageConsumption();//Get the average consumption
  
  	console.log('AVERAGE CONSUMPTION ' + averageConsumption);
    //If the user's consumption is less than the average.
    if (user.consumption < averageConsumption) {
        //Calculate difference, calculate coins to be awarded
        const consumptionDelta = averageConsumption - user.consumption;
	      //Get most recent Wh conversion.
      	const allConversions = await WhtoLUCRegistry.getAll();
        const awardedCoins = consumptionDelta * allConversions[0].conversion;
      
        console.log('ADDING ' + awardedCoins + ' TO ACCOUNT');
      
      	//Create new coins
   		const factory = getFactory();
    	const coin = factory.newResource('org.london.luc', 'Coin', 'COIN_' + Date.now());
      
      	coin.quantity = awardedCoins;//Set quantity
      	coin.owner = user;//Set user
      
      	await coinRegistry.add(coin);//Add coins to registry.
    }
  
  	user.consumption = 0;
    //Update user
    await participantRegistry.update(user);
}

/*
* Gets the average consumption of a household on the chain.
* Useful when calculating how many coins a household should be awarded.
*/
async function getAverageConsumption() {

    //Get registry of particpants
    let participantRegistry = await getParticipantRegistry('org.london.luc.User');
    //Get all users
    const users = await participantRegistry.getAll();

    //Add all consumption
    let totalConsumption = 0;
    for (let i = 0; i < users.length; i++) {
        totalConsumption += users[i].consumption;
    }

    return (totalConsumption/users.length);//Return average.
}
/**
 * Updates the consumption of a particular user
 * @param {org.london.luc.UpdateConsumption} consumptionUpdate
 * @transaction
 */
async function updateConsumption(consumptionUpdate) {
    //Get registry of particpants
    let participantRegistry = await getParticipantRegistry('org.london.luc.User');
  
  	let user = consumptionUpdate.user;
  	
    //Update consumption
    user.consumption += consumptionUpdate.consumption;
    //Update user
    await participantRegistry.update(user);
}

