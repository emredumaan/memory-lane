import Input from '../../components/Input'
import styles from './signin.module.css'
import logo from '../../assets/logo.svg'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'


const Signin: React.FC = () => {
    const {login} = useAuth()

    const schema = yup.object().shape({
        email: yup.string()
            .trim()
            .required('Email is required')
            .email('Invalid email format'),

        password: yup.string()
            .required('Password is required')
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data: any) => {
        try {
            const response = await Axios.post('/api/signin', data)
            toast.success(response.data.message,)
            login(response.data.token,response.data.user)
                        

        } catch (err: any) {
            toast.error(err.response.data.message || 'Something went wrong!')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.brand}>
                <img src={logo} alt="Logo" />
            </div>
            <h1 className={styles.h1}>Sign in</h1>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <Input required label='Email' inputName='email' error={errors.email?.message} register={register} type='email' />
                <Input required label='Password' inputName='password' error={errors.password?.message} register={register} type='password' passdToggle={true} />
                <Button style={{marginTop:'1rem'}} text='Sign in' type='submit' />
                <span className={styles.span}>Don't have an account? <Link to='/signup'>Create one!</Link></span>
            </form>
        </div>
    )
}

export default Signin