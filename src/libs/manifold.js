const util = require("./util");
/**
 * Gets all markets in a group.
 * @param {string} GroupId The id of the manifold group
 * @return {Array} Array of all markets in the group
 */
module.exports.getMarketsFromGroup = async function(GroupId) {
    return await fetch(`https://manifold.markets/api/v0/group/by-id/${GroupId}/markets`).then(_=>_.json())
}
/**
 * Gets Probability of market.
 * @param {string} marketId The id of the manifold market
 * @return {number} Current market probability
 */
module.exports.getProbability = async function(marketId) {
    return (await fetch(`https://manifold.markets/api/v0/market/${marketId}`).then(_=>_.json())).probability * 100
}
/** Market Class */
class Market {
     /**
     * @param {object} market - The market object from manifold api.
     */
    constructor(market){
        this.name = market.question.replace("(Permanent)","");
        this.id = market.id;
        this.color = util.getColor(this.id);
        this.initalize();
    }

    /**
     * Initalizes the class ( needed to avoid async problems )
     */
    async initalize(){
        this.price = await this.getPrice()
    }
    /**
     * Gets the price of the market
     * @return {number} The price
     */
    async getPrice(){
        return await module.exports.getProbability(this.id)
    }
}
/**
 * Gets markets from destiny.gg group.
 * @return {Map} List of destiny.gg markets
 */
module.exports.getDggMarkets = async function(){
    let markets = new Map();

    // get markets from destiny group
    (await module.exports.getMarketsFromGroup("W2ES30fRo6CCbPNwMTTj")).forEach(market => {
        // checks if memestiny or coolio made the market and if its permanent 
        if ( (market.creatorId == "lQdCwuc1OrZLUqgA4EwjPSSwG5Z2" || market.creatorId == "GgEwiiBGdmUrMJhqIOnH2rGCSSt1") && market.question.includes("(Permanent)") ){
            markets.set(market.id, new Market(market))
        }
    })

    return markets;
}