import Input from '../../components/Input'
import styles from './signup.module.css'
import logo from '../../assets/logo.svg'
import Button from '../../components/Button'
import { Link, useNavigate} from 'react-router-dom'
import { useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'axios'
import { toast } from 'react-toastify'



const Signup: React.FC = () => {
    const schema = yup.object().shape({
        name: yup.string()
            .trim()
            .required('Full name is required')
            .min(2,'Name has to contain at least 2 characters.')
            .matches(/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Full name can only contain letters and spaces'),

        email: yup.string()
            .trim()
            .required('Email is required')
            .email('Invalid email format'),

        password: yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),

        passwordConfirm: yup.string()
            .oneOf([yup.ref('password'), null as any], 'Passwords must match')
            .required('Password confirmation is required')
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const navigate = useNavigate()

    const onSubmit = async (data: any) => {
        try {
            const response = await Axios.post('/api/signup', data)
            toast.success(response.data.message)
            navigate('/signin')

        } catch (err: any) {
            toast.error(err.response.data.message || 'Something went wrong!')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.brand}>
                <img src={logo} alt="Logo" />
            </div>
            <h1 className={styles.h1}>Sign up</h1>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <Input required label='Name' inputName='name'
                    error={errors.name?.message}
                    register={register} type='text' />

                <Input required label='Email' inputName='email'
                    error={errors.email?.message}
                    register={register} type='email' />

                <Input required label='Password' inputName='password'
                    error={errors.password?.message}
                    register={register} type='password' passdToggle={true} />

                <Input required label='Password confirm' inputName='passwordConfirm'
                    error={errors.passwordConfirm?.message as any}
                    register={register} type='password' passdToggle={true} />

                <Button style={{ marginTop: '1rem' }} text='Sign up' type='submit' />
                <span className={styles.span}>Already have an account? <Link to='/signin'>Sign in</Link>.</span>
            </form>
        </div>
    )
}

export default Signup