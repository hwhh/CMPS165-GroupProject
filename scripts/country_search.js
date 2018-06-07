import * as utils from './index'
import React, {Component} from 'react'
import {render} from 'react-dom';
import * as ReactDOM from "react-dom";
import ReactModal from "react-modal";
import {display_country} from "./variables";
import {renderLineChart} from "./line_chart";
import Checkbox from "react-bootstrap/es/Checkbox";
import {FormGroup} from "react-bootstrap";

const button_style = {
    transform: 'translate(100px, 680px)',
};


const column = {
    float: 'left',
    width: '40%',
    padding: '5px'
};
//
// /* Clear floats after image containers */
// const row::after = {
//     content: "";
//     clear: both;
//     display: table;
// }


export function create_modal() {
    const props = {countries: utils.water_stress};
    ReactDOM.render(<Model {...props} />, document.getElementById('root'));
}


class Model extends React.Component {
    constructor(props) {
        super(props);
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
        renderLineChart()
    }

    static handleChange(event) {
        display_country[event.target.value].display = !!event.target.checked;
    }

    render() {
        return (
            <div>
                <button style={button_style} onClick={this.handleOpenModal}>Add countries</button>
                <ReactModal
                    // className="Modal"
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    ariaHideApp={false}
                >
                    <button onClick={this.handleCloseModal}>Close Modal</button>

                    <FilteredList/>

                </ReactModal>
            </div>
        )
    }
}


class FilteredList extends React.Component {

    constructor(props) {
        super(props);
        let checked = [], unChecked = [];
        Object.keys(display_country).forEach(function (key) {
            if (!display_country[key].display) {
                unChecked.push(key);
            } else
                checked.push(key)
        });
        this.state = {
            unChecked: unChecked,
            checked: checked,
            items: []
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.filterList = this.filterList.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);

    }

    handleOpenModal() {
        this.setState({showModal: true});
    }

    filterList(event) {
        let updatedList = this.state.unChecked;
        updatedList = updatedList.filter(function (item) {
            return item.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;
        });
        this.setState({items: updatedList});
    }

    componentWillMount() {
        this.setState({items: this.state.unChecked})
    }

    render() {
        return (
            <div className="filter-list">
                <form>
                    <fieldset className="form-group">
                        <input type="text" className="form-control form-control-lg" placeholder="Search"
                               onChange={this.filterList}/>
                    </fieldset>
                </form>
                <div className={"row"}>
                    <List items={this.state.unChecked} type={"Unselected:"}/>
                    <List items={this.state.checked} type={"Selected:"}/>
                </div>
            </div>
        );
    }
}


class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: props.items,
            type: props.type
        };
    }

    static handleChange(event) {
        display_country[event.target.value].display = !!event.target.checked;
    }

    render() {
        return (

            <FormGroup style={column}>
                <label>{this.state.type}</label>
                {this.state.items.map(function (object, i) {
                    return <Checkbox defaultChecked={display_country[object].display} value={object}
                                     onChange={List.handleChange}
                    >{object}</Checkbox>
                })}
            </FormGroup>
        )
    }
}