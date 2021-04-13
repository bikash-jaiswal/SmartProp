import React, {Component} from 'react';
import ipfs from './ipfs';
import ArtStore from '../abis/ArtStore.json';

class Main extends Component{

    constructor(props){
        super(props)
        this.state  = {
            buffer: null,
            ipfsHash: ''
        }
        this.captureFile = this.captureFile.bind(this)
    }
    
    captureFile(event){
        console.log('capture file...')
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () =>{
            this.setState({buffer : Buffer(reader.result)})
            console.log('buffer', this.state.buffer)
        }
    }

    render(){
        return(
            <div id="content">
                <form onSubmit={(event)=> {
                    event.preventDefault()
                    console.log('on submit...')
                    ipfs.files.add(this.state.buffer, (error, result) => {
                        if(error){
                            console.error(error)
                            return
                        }
                        this.setState({ ipfsHash: result[0].hash })
                        console.log('ipfshash ', this.state.ipfsHash)
                        const name = this.itemName.value
                        const price = window.web3.utils.toWei(this.itemPrice.value.toString(), 'Ether')
                        const desc = this.itemDescription.value
                        this.props.addItem(name, price, desc, this.state.ipfsHash)
                    })
                }}>
                <div className="form-group mr-md-3">
                    <input
                        id="itemName"
                        type="text"
                        ref={(input) => { this.itemName = input }}
                        className="form-control"
                        placeholder="Property Name"
                        required/>
                 </div>
                 <div className="form-group mr-md-3">
                    <input
                        id="itemPrice"
                        type="text"
                        ref={(input) => { this.itemPrice = input }}
                        className="form-control"
                        placeholder="Price"
                        required/>
                 </div>
                 <div className="form-group mr-md-3">
                    <input
                        id="itemDescription"
                        type="text"
                        ref={(input) => { this.itemDescription = input }}
                        className="form-control"
                        placeholder="Description"
                        required/>
                 </div>
                 <div className="form-group mr-md-3">
                 <input type='file' onChange={this.captureFile}/>
                 </div>
                 <button type="submit" className="btn btn-primary">Add Item</button>
                </form>
                <p></p>
                <table className="table">
                    <thead>
                    </thead>
                    <tbody id="itemList">
                        {this.props.items.map((item, key) => {
                            return(
                                <tr key={key}>
                                    <td><img src={`https://ipfs.io/ipfs/${item.ipfsHash}`} width="384" height="auto" alt=""/></td>
                                    <td>
                                    <tr scope="row">
                                    <td><b>Property Name</b></td><td>{item.itemName}</td>
                                    </tr>
                                    <tr scope="row">
                                    <td><b>Description</b></td><td>{item.itemDescription}</td>
                                    </tr>
                                    <tr scope="row">
                                    <td><b>Price</b></td><td>{window.web3.utils.fromWei(item.itemPrice.toString(), 'Ether')} Eth</td>
                                    <td>
                                    <td><button 
                                        name={item.itemId}
                                        onClick={(event)=>
                                                this.props.editItemCheck(event.target.name)}>Edit</button></td>
                                    </td>
                                    </tr>
                                    <tr scope="row">
                                    <td><b>Owner</b></td><td>{item.owner.toString()}</td>
                                    </tr>
                                    <tr scope="row">
                                    <td><b>Status</b></td>
                                    <td>{(item.owner.toString()!==this.props.getSender().toString())
                                       
                                        ? <button
                                        name={item.itemId}
                                        value={item.itemPrice} 
                                        onClick={(event)=>{
                                            this.props.itemPurchase(event.target.name, event.target.value)
                                        }}
                                        >
                                        Buy
                                        </button>
                                            : 'You are the owner of this property'
                                        }</td>
                                    <td><button onClick={(event)=>{alert("Previous owners: \n"+item.buyers)}}>View Past Owners</button></td>
                                    </tr>
                                    <tr scope="row">
                                    <td></td>
                                    <td>{(item.invader.toString()==="0x0000000000000000000000000000000000000000")
                                        ? <td style={{color:'blue'}}>{item.notifMsg}</td>
                                    :<td style={{color:'red'}}>{item.invader}{item.notifMsg}</td>}</td>
                                    </tr>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}
export default Main;