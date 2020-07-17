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