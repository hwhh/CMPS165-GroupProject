import * as utils from './index'
import React, {Component} from 'react'
import {render} from 'react-dom';
import * as ReactDOM from "react-dom";
import ReactModal from "react-modal";

export function create_modal() {

    const divStyle = {
        transform: 'translate(100px, 680px)',
    };

    class ExampleApp extends React.Component {
        constructor(props) {
            super(props);
            console.log(props)

            this.state = {
                showModal: false
            };
            this.handleOpenModal = this.handleOpenModal.bind(this);
            this.handleCloseModal = this.handleCloseModal.bind(this);

        }

        handleOpenModal() {
            this.setState({showModal: true});
        }

        handleCloseModal() {
            this.setState({showModal: false});
        }

        static handleChange(event) {
            console.log(event.target.checked, event.target.value);
        }

        render() {
            return (
                <div>
                    <button style={divStyle} onClick={this.handleOpenModal}>Add countries</button>
                    <ReactModal
                        // className="Modal"
                        isOpen={this.state.showModal}
                        contentLabel="Minimal Modal Example"
                        ariaHideApp={false}
                    >
                        <button onClick={this.handleCloseModal}>Close Modal</button>

                        <input type="text" placeholder="Search.."/>
                        <ul>
                            {props.countries.map(function (object, i) {
                                return <li> <label> <input type="checkbox" name="checkbox" onChange={ExampleApp.handleChange} value={object.id}/> {object.id} </label> </li>;
                                })}
                        </ul>

                    </ReactModal>
                </div>
            );
        }
    }

    const props = {countries: utils.water_stress};
    ReactDOM.render(<ExampleApp {...props} />, document.getElementById('root'));
}
