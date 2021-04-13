import React, {Component} from 'react';

class Footer extends Component{

    render(){
        return (
            <nav className="navbar navbar-dark fixed-bottom bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <small className="text-white">
                    Project Presented by Group 19 : Bikash, Binsar and Keshav @DS Project [Concordia University]
                    </small>
                </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <medium className="text-white">Supervisor : Essam Mansour</medium>
                    </li>
                </ul>
            </nav>
        );
    }
}
export default Footer;