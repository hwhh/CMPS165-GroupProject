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
        let items = {};
        Object.keys(display_country).forEach(function (key) {
            items[key] = display_country[key].display;
        });
        this.state = {
            items: {}
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.filterList = this.filterList.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleOpenModal() {
        this.setState({showModal: true});
    }

    filterList(event) {
        let updatedList = this.state.items;
        updatedList = Object.keys(updatedList).filter(function (item) {
            return item.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;
        });
        this.setState({items: updatedList});
    }

    componentWillMount() {
        this.setState({items: this.state.items})
    }

    handleChange(event) {
        display_country[event.target.value].display = !!event.target.checked;
        let dict = this.state.items;
        dict[event.target.value] = !!event.target.checked;
        this.setState({unChecked: dict});

        // if (event.target.checked) {
        //     let arr1 = this.state.items;
        //     delete arr1[event.target.value];
        //     let arr2 = this.state.checked;
        //     arr2[event.target.value] = true;
        //     this.setState({
        //         checked: arr2,
        //         items: arr1,
        //         unChecked: arr1,
        //     });
        // } else {
        //     let arr1 = this.state.checked;
        //     delete arr1[event.target.value];
        //     let arr2 = this.state.items;
        //     arr2[event.target.value] = false;
        //     this.setState({
        //         checked: arr1,
        //         items: arr2,
        //         unChecked: arr2,
        //     });
    }
}

render()
{
    return (
        <div className="filter-list">
            <form>
                <fieldset className="form-group">
                    <input type="text" className="form-control form-control-lg" placeholder="Search"
                           onChange={this.filterList}/>
                </fieldset>
            </form>
            <div className={"row"}>
                <List handleChange={this.handleChange} items={this.state.items} type={"Unselected:"}
                      defChecked={false}/>
                <List handleChange={this.handleChange} items={this.state.items} type={"Selected:"}
                      defChecked={true}/>
            </div>
        </div>
    );
}
}


class List extends React.Component {

    constructor(props) {
        super(props);
        self = this;
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.handleChange(event);
    }

    render() {
        return (
            <FormGroup style={column}>
                <label>{this.props.type}</label>
                {Object.keys(this.props.items).forEach(function (key) {
                    if(self.props.items[key] === self.props.defChecked)
                        return <Checkbox defaultChecked={self.props.items[key]} value={key}
                                         onChange={self.handleChange}>{key}</Checkbox>
                })}
            </FormGroup>
        )
    }
}