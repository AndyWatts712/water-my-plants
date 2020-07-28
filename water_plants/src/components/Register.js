//Hernandez
import React, {useState, useEffect} from "react";
import axios from 'axios';
import * as yup from 'yup'


const initialFormValues = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: ''
}

const initialFormErrors = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: ''
}

const initialUser = []
const initialDisabled = true

export default function Register(props){
    // Props passed in from apps for use in page functions

      const [user, setUser] = useState(initialUser)
      const [formValues, setFormValues] = useState(initialFormValues) 
      const [formErrors, setFormErrors] = useState(initialFormErrors) 
      const [disabled, setDisabled] = useState(initialDisabled)   

      const formSchema = yup.object().shape({
        firstname: yup.string()
                    .min(2, 'Name must be at least 2 characters')
                    .required('First Name is Required'),
        lastname: yup.string()
                    .min(4, 'Last Name must be at least 4 characters'),
        email: yup.string()
                    .required()
                    .min(8, 'Las must be at least 8 characters'),
        password: yup.string()
                    .required('Password is Required')
                    .min('Password must contain at least 8 characters'),
        phone:yup.string()
                    .required('Phone Number is Required')
                    .min(10, 'Phone Number must contain 10 characters')
                    // .max((10, 'Phone Number must contain 10 characters'))
    })

    // prevents page from reloading & calls submit function from App.js
    const postNewUser = newUser => {
        axios.post('https://reqres.in/api/users', newUser)
          .then(res => {
            console.log(res.data)
            setFormValues(initialFormValues)
          })
          .catch(err => {
            debugger
          })
      }

    const onSubmit = evt => {
        evt.preventDefault()
        submit()
      }
      const submit = () => {
        const user = {
          firstname: formValues.firstname.trim(),
          lastname: formValues.lastname.trim(),
          email: formValues.email.trim(),
          password: formValues.password.trim(),
          phone: formValues.phone.trim()
        }
        postNewUser(user)
      }
      
      useEffect(() => {
        formSchema.isValid(formValues).then(valid => {
          setDisabled(!valid)
        })
      }, [formValues])
    
      // pulls name and value from event target. Passthrough to inputChange
      const onInputChange = evt => {
        const { name, value } = evt.target
        inputChange(name, value)
      }
      // second half of input change
      const inputChange = (name, value) => {

        yup
          .reach(formSchema, name)
          .validate(value)
          .then(valid => {
            setFormErrors({
              ...formErrors,
              [name]: "",
            })
          })
    
          .catch(err => {
            console.log(name)
            setFormErrors({
              ...formErrors,
              [name]: err.errors,
            })
          })
    
        setFormValues({
          ...formValues,
          [name]: value 
        })
      }

    // build elements for form/ inputs for first name, last name, email, phone number, and password
    return(
       
        <div className='registration'>
            <h2>Join WaterMyPlants Today!</h2>
            <div className='errors-container'>
                <div>{formErrors.firstname}</div>
                <div>{formErrors.lastname}</div>
                <div>{formErrors.email}</div>
                <div>{formErrors.phone}</div>
                <div>{formErrors.password}</div>
            </div>

            <form>
                <label>First Name:&nbsp;
                    <input 
                        value={formValues.firstname}
                        onChange={onInputChange} // checkes
                        placeholder='First Name'
                        maxlength='14'
                        name='firstname'
                        type='text'
                    />

                </label>
                <label>Last Name: &nbsp;
                    <input 
                        value={formValues.lastname}
                        onChange={onInputChange}
                        placeholder='Last Name'
                        maxlength='14'
                        name='lastname'
                        type='text'
                    />
                </label>
                <label>E-Mail: &nbsp;
                    <input 
                        value={formValues.email}
                        onChange={onInputChange}
                        placeholder='E-mail'
                        maxlength='14'
                        name='email'
                        type='email'
                    />
                </label>
                <label>Phone Number: &nbsp;
                    <input 
                        value={formValues.phone}
                        onChange={onInputChange}
                        placeholder='Phone Number'
                        maxlength='14'
                        name='phone'
                        type='text'
                    />
                </label>
                <label>Password &nbsp;
                    <input 
                        value={formValues.password}
                        onChange={onInputChange}
                        placeholder='Password'
                        maxlength='14'
                        name='password'
                        type='text'
                    />
                </label>
                <button disabled={disabled} >Submit</button>
            </form>
        </div>
    )
}