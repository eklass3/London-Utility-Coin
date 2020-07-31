/*
* Coin - consumption constant. Will be dynamic at some point...
*/
const COIN_CONSTANT = 0.25;


/**
 * Track the trade of a luc from one trader to another
 * @param {org.london.luc.Trade} trade - the trade to be processed
 * @transaction
 */
async function tradeCoin(trade) {

    // set the new owner of the luc
    trade.coin.owner = trade.newOwner;
    let assetRegistry = await getAssetRegistry('org.london.luc.Coin');

    // emit a notification that a trade has occurred
    let tradeNotification = getFactory().newEvent('org.london.luc', 'TradeNotification');
    tradeNotification.coin = trade.coin;
    emit(tradeNotification);

    // persist the state of the luc
    await assetRegistry.update(trade.coin);
}

/**
 * Awards coins to a user based on their consumption.
 * @param {org.london.luc.AwardCoin} award
 * @transaction
 */
async function awardCoins(award) {

    //Get registry of particpants
    let participantRegistry = await getParticipantRegistry('org.london.luc.User');
  	let assetRegistry = await getAssetRegistry('org.london.luc.Coin');
 
  	const user = award.owner;//Get the new owner of the coins
	const averageConsumption = await getAverageConsumption();//Get the average consumption
  
  	console.log('AVERAGE CONSUMPTION ' + averageConsumption);
    //If the user's consumption is less than the average.
    if (user.consumption < averageConsumption) {
        //Calculate difference, calculate coins to be awarded
        const consumptionDelta = averageConsumption - user.consumption;

        const awardedCoins = consumptionDelta * COIN_CONSTANT;
      
        console.log('ADDING ' + awardedCoins + ' TO ACCOUNT');
      
      	//Create new coins
   		const factory = getFactory();
    	const coin = factory.newResource('org.london.luc', 'Coin', 'COIN_' + Date.now());
      
      	coin.quantity = awardedCoins;//Set quantity
      	coin.owner = user;//Set user
      
      	await assetRegistry.add(coin);//Add coins to registry.
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
