import React from 'react'
import { connect } from 'react-redux'
import { addActivity } from '../actions/activities'
import BackButton from '../components/BackButton'

export default class AddActivity extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: "",
            firstNameError: "",
            lastName: "",
            lastNameError: "",
            username: "",
            usernameError: "",
            email: "",
            emailError: "",
            password: "",
            passwordError: ""
        };
        this.change = this.change.bind(this)
    }



    change = e => {
        this.props.onChange({ [e.target.name]: e.target.value });
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    validate = () => {
        let isError = false;
        const errors = {
            firstNameError: "",
            lastNameError: "",
            usernameError: "",
            emailError: "",
            passwordError: ""
        };

        if (this.state.firstName.length < 5) {
            isError = true;
            errors.usernameError = "Username needs to be atleast 5 characters long";
        }

        // if (this.state.email.indexOf("@") === -1) {
        //     isError = true;
        //     errors.emailError = "Requires valid email";
        // }

        this.setState({
            ...this.state,
            ...errors
        });

        return isError;
    };

    handleSubmit = e => {
        e.preventDefault();
        // this.props.onSubmit(this.state);
        
        const err = this.validate();

        if (!err) {
            // clear form
            this.setState({
                firstName: "",
                firstNameError: "",
                lastName: "",
                lastNameError: "",
                username: "",
                usernameError: "",
                email: "",
                emailError: "",
                password: "",
                passwordError: ""
            });
            this.props.onChange({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: ""
            });
            
        }
    };


    render() {
        return [
         <ion-header>
             <ion-toolbar>
                 <ion-title>Add Activity</ion-title>
                     <ion-buttons slot="start">
                         <BackButton/>
                     </ion-buttons>
             </ion-toolbar>
         </ion-header>,
            <form onSubmit={e => this.handleSubmit(e)}>
                <ion-list>
                    <ion-item>
                        <ion-label color="primary" position="stacked">First name</ion-label>
                        <ion-input
                            type="text"
                            name="firstName"
                            value={this.state.firstName}
                            ionChange={this.change}>
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label color="primary" position="stacked">last name</ion-label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={this.state.lastName} 
                            onChange={this.change}>
                        </input>
                    </ion-item>
                <br />
                </ion-list>
                <ion-button type="submit" value="Submit" expand="full">
                     Add Activity
                </ion-button>
            </form>
         ];
    }

}

// const AddActivity = ({ dispatch }) => {
//     let input

//     return [
//         <ion-header>
//             <ion-toolbar>
//                 <ion-title>Add Activity</ion-title>
//                     <ion-buttons slot="start">
//                         <BackButton/>
//                     </ion-buttons>
//             </ion-toolbar>
//         </ion-header>,
//             <form
//                 onSubmit={e => {
//                     e.preventDefault()
//                     if (!input.value.trim()) {
//                         return
//                     }
//                     dispatch(addActivity(input.value))
//                     input.value = ''
//                 }}
//             >
//                 <ion-list>
//                     <ion-item>
//                         <ion-label color="primary" position="stacked">Title</ion-label>
//                         <ion-input type="text" ref={node => input = node}></ion-input>
//                     </ion-item>
//                 </ion-list>
//                 <ion-button type="submit" expand="full">
//                     Add Activity
//                 </ion-button>
//             </form>
//             ]
// }

// export default connect()(AddActivity)