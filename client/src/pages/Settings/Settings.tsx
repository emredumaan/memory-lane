import ProfilePicture from '../../components/ProfilePicture'
import styles from './settings.module.css'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import Input from '../../components/Input'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import '@sweetalert2/theme-dark/dark.css'

interface NameFormData {
    newName: string
}

interface PasswordFormData {
    currentPassword: string
    newPassword: string
    newPasswordConfirm: string
}

const Settings = () => {
    const { user, logout, verifyToken } = useAuth()
    const [nameChanging, setNameChanging] = useState<boolean>(false)
    const [passwordChanging, setPasswordChanging] = useState<boolean>(false)

    const nameSchema = yup.object().shape({
        newName: yup.string().trim().required('Name is required').min(2, 'Name must be at least 2 characters').matches(/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Name can only contain letters and spaces'),
    })

    const passwordSchema = yup.object().shape({
        currentPassword: yup.string().required('Please enter your current password'),
        newPassword: yup.string().required('Please enter a new password').min(6, 'Password must be at least 6 characters'),
        newPasswordConfirm: yup.string().required('Please confirm your new password').oneOf([yup.ref('newPassword')], 'Passwords must match'),
    })

    const { register: register_n, handleSubmit: handleSubmit_n, formState: { errors: errors_n } } = useForm({
        resolver: yupResolver(nameSchema)
    })
    const { register: register_p, handleSubmit: handleSubmit_p, formState: { errors: errors_p } } = useForm({
        resolver: yupResolver(passwordSchema)
    })

    const toggle = (stateFunc: React.Dispatch<React.SetStateAction<boolean>>) => {
        stateFunc((value) => !value)
        if (stateFunc === setNameChanging && passwordChanging) setPasswordChanging(false)
        if (stateFunc === setPasswordChanging && nameChanging) setNameChanging(false)
    }

    const submitName = async (data: NameFormData) => {
        try {
            const response = await Axios.post('/api/change-name', data)
            toast.success(response.data.message)
            setNameChanging(false)
            verifyToken()
        } catch (err: any) {
            toast.error(err.response.data.message || 'Something went wrong.')
        }
    }

    const submitPassword = async (data: PasswordFormData) => {
        try {
            const response = await Axios.post('/api/change-password', data)
            toast.success(response.data.message)
            setPasswordChanging(false)
            logout()
        } catch (err: any) {
            toast.error(err.response.data.message || 'Something went wrong.')
        }
    }

    const deleteAccount = async () => {
        const confirm = await Swal.fire({
            title: 'Delete Account?',
            text: 'Your account will be deleted permanently. Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary-color)',
            cancelButtonColor: 'var(--danger-color)',
            focusCancel: true
        })

        if (!confirm.isConfirmed) return false

        try {
            const response = await Axios.delete('/api/delete-user')
            toast.info(response.data.message)
            logout()
        } catch (err: any) {
            toast.error(err.response.data.message || 'Something went wrong.')
        }
    }

    useEffect(() => {
        document.querySelectorAll(`.${styles.settingForm}`).forEach((form: any) => {
            form.reset()
        })
    }, [nameChanging, passwordChanging])

    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <div className={styles.pfp}>
                    <ProfilePicture name={user?.name || ''} />
                </div>
                <div className={styles.info}>
                    <span className={styles.name}>
                        {user?.name}
                    </span>
                    <span className={styles.email}>
                        {user?.email}
                    </span>
                </div>
            </div>
            <div className={styles.settings}>
                <h2>Settings</h2>
                <section>
                    <span className={styles.sectionHeader}>
                        <span className={styles.text}>
                            Account
                        </span>
                    </span>
                    <menu>
                        <li>
                            <button
                                className={nameChanging ? styles.active : ''}
                                onClick={() => toggle(setNameChanging)}
                                type='button'
                            >
                                Change name
                            </button>
                            {nameChanging && (
                                <div className={styles.changeField}>
                                    <form className={styles.settingForm} onSubmit={handleSubmit_n(submitName)}>
                                        <Input inputName='newName' label='New name' register={register_n} error={errors_n.newName?.message} />
                                        <button className={styles.submit} type='submit'>Save</button>
                                    </form>
                                </div>
                            )}
                        </li>
                        <li>
                            <button
                                className={passwordChanging ? styles.active : ''}
                                onClick={() => toggle(setPasswordChanging)}
                                type='button'
                            >
                                Change Password
                            </button>
                            {passwordChanging && (
                                <div className={styles.changeField}>
                                    <form className={styles.settingForm} onSubmit={handleSubmit_p(submitPassword)}>
                                        <div style={{ padding: '1rem 0' }}>
                                            <Input type='password' passdToggle={true} inputName='currentPassword' label='Current password' register={register_p} error={errors_p.currentPassword?.message} />
                                        </div>
                                        <hr />
                                        <Input type='password' passdToggle={true} inputName='newPassword' label='New password' register={register_p} error={errors_p.newPassword?.message} />
                                        <Input type='password' passdToggle={true} inputName='newPasswordConfirm' label='Confirm new password' register={register_p} error={errors_p.newPasswordConfirm?.message} />
                                        <button className={styles.submit} type='submit'>Save</button>
                                    </form>
                                </div>
                            )}
                        </li>
                        <li>
                            <button onClick={deleteAccount} className={styles.danger} type='button'>Delete account</button>
                        </li>
                    </menu>
                </section>
            </div>
        </div>
    )
}

export default Settings
