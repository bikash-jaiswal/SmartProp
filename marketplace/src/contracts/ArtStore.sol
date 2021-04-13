pragma solidity >=0.5.8;

/**
*This is a smart contract for storing pictures, their prices,
*their buyers and sellers,as well as their descriptions.
*The codes are based from the following
*Title: How To Build A Blockchain App with Ethereum, Web3.js & Solidity Smart Contracts
*Author: Gregory McCubbin
*Date: 2019
*Availability: https://www.dappuniversity.com/articles/how-to-build-a-blockchain-app
 */
contract ArtStore{
    string public itemName;
    uint public itemCount = 0;
    mapping(uint => Item) public items;

    constructor() public{
        itemName = "Property Store";
    }

    //The data structure of the item
    struct Item{
        uint itemId; //Unique ID for the item
        string itemName; //Name of the item
        uint itemPrice; //Cost of the item
        string itemDescription; //Short description of the item
        string ipfsHash; //The IPFS Hash
        address payable owner; //The owner of the item
        string buyers; //List of those who have bought this item
        address invader; //The user who attempts to tamper with the item
        string notifMsg; //Check if a person tried to tamper with the item
    }



    /**
    This is the function to add an item in blockchain.
     */
    function addItem(string memory _itemName, uint _itemPrice, string memory _itemDescription, string memory _ipfsHash) public{
        //The name should be at least 1 byte
        require(bytes(_itemName).length > 0,"The name should be at least 1 byte.");
        //Item price should be greater than zero
        require(_itemPrice > 0,"Item price should be greater than zero");
        //Stock count should be greater than zero
    
        //This is for counting the item
        itemCount++;
        //Adding the item
        items[itemCount] = Item(itemCount, _itemName, _itemPrice, _itemDescription, _ipfsHash, msg.sender, "", address(0), '');
        //Triggering an event on item addition
        emit ItemAdded(itemCount, _itemName, _itemPrice, _itemDescription, _ipfsHash, msg.sender, "", address(0), '');
    }

    /**
    This event gives notification to the buyers that an item has been added to the blockchain
     */
    event ItemAdded(
        uint itemId,
        string itemName,
        uint itemPrice,
        string itemDescription,
        string ipfsHash,
        address payable owner,
        string buyers,
        address invader,
        string notifMsg
    );

    function itemPurchase(uint _itemId) public payable{
        Item memory _item = items[_itemId];
        address payable _seller = _item.owner;
        require(_item.itemId > 0 && _item.itemId <= itemCount, "illigal index.");
        require(msg.value >= _item.itemPrice, "value must be greater than itemprice.");
        //require(!_item.purchased,"item is already purchased.");
        require(_seller != msg.sender,"ownership is invalid.");
        _item.owner = msg.sender;
        //This is for converting address to string
        /**
         *Title: Convert address to string
         *Author: Anton Bukov, Aliaksandr Adzinets
         *Date: 2018
         *Availability: https://ethereum.stackexchange.com/questions/8346/convert-address-to-string/51484#51484
         *Bukov, A. (2018). 
         *Convert address to string.
         *[online] Ethereum Stack Exchange. 
         *Available at: https://ethereum.stackexchange.com/questions/8346/convert-address-to-string/51484#51484 
         *[Accessed 14 Nov. 2019].
         */
         bytes32 value = bytes32(uint256(_seller));
         bytes memory alphabet = "0123456789abcdef";

         bytes memory str = new bytes(42);
         str[0] = '0';
         str[1] = 'x';
         for (uint i = 0; i < 20; i++) {
         str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
         str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
         }
        _item.buyers = string(abi.encodePacked(_item.buyers," ",string(str)));
        items[_itemId] = _item;
        address(_seller).transfer(msg.value);
        emit ItemPurchased(itemCount, _item.itemName, _item.itemPrice, _item.itemDescription, _item.ipfsHash, msg.sender, _item.buyers, address(0), "");
    }

    event ItemPurchased(
        uint itemId,
        string itemName,
        uint itemPrice,
        string itemDescription,
        string ipfsHash,
        address payable owner,
        string buyers,
        address invader,
        string notifMsg
    );

    /**
    This is the function to edit an item in blockchain.
     */
    function editItemCheck(uint _itemId) public{
        Item memory _item = items[_itemId];
        address payable _seller = _item.owner;
        //Validating the sender
        if(_seller != msg.sender){
            _item.invader = msg.sender;
            _item.notifMsg = " attempted to tamper with the price";
        }
        else{
            _item.invader = address(0);
            _item.notifMsg="Owner updated the price";
        }
        //Updating the item
        items[_itemId] = Item(_item.itemId, _item.itemName, _item.itemPrice, _item.itemDescription, _item.ipfsHash, _item.owner, _item.buyers, _item.invader, _item.notifMsg);
        //Triggering an event on item addition
        emit ItemEdited(_item.itemId, _item.itemName, _item.itemPrice, _item.itemDescription, _item.ipfsHash, _item.owner, _item.buyers, _item.invader, _item.notifMsg);
    }

        /**
    This event gives notification to the buyers that an item has been added to the blockchain
     */
    event ItemEdited(
        uint itemId,
        string itemName,
        uint itemPrice,
        string itemDescription,
        string ipfsHash,
        address payable owner,
        string buyers,
        address invader,
        string notifMsg
    );
}