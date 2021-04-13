const ArtStore = artifacts.require('./ArtStore.sol')
require('chai').use(require('chai-as-promised')).should()

contract('ArtStore', ([deployer, seller, buyer]) => {
    let artstore

    before(async () => {
        artstore = await ArtStore.deployed()
    })

    contract('deployment', async () => {
        it('deploys successfully', async() => {
            const address = await artstore.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async() => {
            const name = await artstore.itemName()
            assert.equal(name, 'Market')
        })
    })

    contract('items', async() => {
        let output, itemCount

        before(async () => {
            output = await artstore.addItem('Mona Lisa', web3.utils.toWei('1','Ether'), 'A masterpiece by Leonardo Da Vinci', {from: seller})
            itemCount = await artstore.itemCount()
        })

        it('adds items', async() => {
            //This for checking if item count is 1
            assert.equal(itemCount,1)
            //Logging an event to a history log
            const event = output.logs[0].args
            //Check item content is correct
            assert.equal(event.itemId.toNumber(), itemCount.toNumber(), 'Item ID is correct')
            assert.equal(event.itemName, 'Mona Lisa', 'Item name is correct')
            assert.equal(event.itemPrice, '1000000000000000000', 'Item price is correct')
            assert.equal(event.itemDescription, 'A masterpiece by Leonardo Da Vinci', 'Item description is correct')
            assert.equal(event.owner, seller, 'Item owner is correct')
            assert.equal(event.purchased, false, 'Item purchased is correct')
            //Purposely make the tests wrong
            await artstore.addItem('', web3.utils.toWei('1', 'Ether'), '', {from: seller}).should.be.rejected;
            await artstore.addItem('Mona Lisa', 0, 'A masterpiece by Michelangelo', {from: seller}).should.be.rejected;
        })

        it('sells items', async() => {
            let sellerpreviousBalance
            sellerpreviousBalance = await web3.eth.getBalance(seller)
            sellerpreviousBalance = new web3.utils.BN(sellerpreviousBalance)

            output = await artstore.itemPurchase(itemCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})
            const event = output.logs[0].args
            assert.equal(event.itemId.toNumber(), itemCount.toNumber(), 'id is correct')
            assert.equal(event.itemName, 'Mona Lisa', 'Item name is correct')
            assert.equal(event.itemPrice, '1000000000000000000', 'Item price is correct')
            assert.equal(event.itemDescription, 'A masterpiece by Leonardo Da Vinci', 'Item description is correct')
            assert.equal(event.owner, buyer, 'Item owner is correct')
            assert.equal(event.purchased, true, 'Item purchased is correct')

            let updateBalanceOfSeller
            updateBalanceOfSeller = await web3.eth.getBalance(seller)
            updateBalanceOfSeller = new web3.utils.BN(updateBalanceOfSeller)

            let priceToAdd
            priceToAdd = web3.utils.toWei('1', 'Ether')
            priceToAdd = new web3.utils.BN(priceToAdd)

            const newBalance = sellerpreviousBalance.add(priceToAdd)

            assert.equal(updateBalanceOfSeller.toString(), newBalance.toString())
            
  
        })
    })



    
})