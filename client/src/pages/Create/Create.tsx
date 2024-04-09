import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'axios'
import { toast } from 'react-toastify'
import { TbWorld } from 'react-icons/tb'
import { MdLockOutline } from 'react-icons/md'
import ListItem from '@tiptap/extension-list-item'
import TextStyle, { TextStyleOptions } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { GoBold, GoItalic, GoStrikethrough, GoCode, GoHorizontalRule } from 'react-icons/go'
import { BiCodeBlock } from 'react-icons/bi'
import { PiParagraphFill, PiListBulletsBold, PiListNumbersBold } from 'react-icons/pi'
import { RiH1, RiH2, RiH3 } from 'react-icons/ri'
import { GrBlockQuote } from 'react-icons/gr'
import { LuUndo2, LuRedo2, LuHighlighter } from 'react-icons/lu'
import Input from '../../components/Input'
import Button from '../../components/Button'
import styles from './create.module.css'

const MenuBar: React.FC = () => {
    const { editor } = useCurrentEditor()
    const [isSticky, setIsSticky] = useState<boolean>(false)

    if (!editor) {
        return null
    }

    useEffect(()=> {
        const topMenu = document.querySelector(`.${styles.topMenu}`) as any
        topMenu.classList.toggle(styles.hasScrollbar, topMenu.scrollWidth > topMenu.clientWidth)
    },[])

    useEffect(() => {
        const handleScroll = () => {
            const tiptapElement = document.querySelector(`.${styles.tiptap}`) as any
            const rect = tiptapElement?.getBoundingClientRect()
            if (rect?.top <= 75) {
                setIsSticky(true)
            } else {
                setIsSticky(false)
            }

        }
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])
    return (
        <div className={`${styles.topMenu} ${isSticky ? styles.sticky : ''}`}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
                className={editor.isActive('bold') ? styles.isActive : ''}
            >
                <GoBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
                className={editor.isActive('italic') ? styles.isActive : ''}
            >
                <GoItalic />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run()
                }
                className={editor.isActive('strike') ? styles.isActive : ''}
            >
                <GoStrikethrough />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleCode()
                        .run()
                }
                className={editor.isActive('code') ? styles.isActive : ''}
            >
                <GoCode />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? styles.isActive : ''}
            >
                <BiCodeBlock />
            </button>
            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive('paragraph') ? styles.isActive : ''}
            >
                <PiParagraphFill />

            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}
            >
                <RiH1 />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? styles.isActive : ''}
            >
                <RiH2 />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive('heading', { level: 4 }) ? styles.isActive : ''}
            >
                <RiH3 />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? styles.isActive : ''}
            >
                <PiListBulletsBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? styles.isActive : ''}
            >
                <PiListNumbersBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? styles.isActive : ''}
            >
                <GrBlockQuote />
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <GoHorizontalRule />
            </button>
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .undo()
                        .run()
                }
            >
                <LuUndo2 />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .redo()
                        .run()
                }
            >
                <LuRedo2 />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={editor.isActive('highlight') ? styles.isActive : ''}
            >
                <LuHighlighter />
            </button>
        </div>
    )
}

interface CustomTextStyleOptions extends Partial<TextStyleOptions> {
    types?: string[]
}

const extensions = [
    Highlight.configure({
        HTMLAttributes: {
            class: styles.highlighted
        }
    }),
    TextStyle.configure({ types: [ListItem.name] } as CustomTextStyleOptions),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
]

const Create: React.FC = () => {
    const schema = yup.object().shape({
        title: yup.string()
            .trim()
            .required('Title is required')
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const startContent = '<h2>Dear diary,</h2><p></p>'

    const [isPublic, setIsPublic] = useState(false)
    const [content, setContent] = useState<string>(startContent)
    const [saveButton,setSaveButton] = useState({text: 'Save', disabled: false}) 
    const navigate = useNavigate()

    interface ReactHookFormData {
        title: string 
    }

    const onSubmit = async (data: ReactHookFormData) => {
        try {
            setSaveButton({text:'Saving...',disabled: true})
            const response = await Axios.post('/api/create', {
                title: data.title,
                content,
                isPublic
            })
            setSaveButton({text:'Save',disabled: false})
            toast.success(response.data.message)
            navigate('/me')

        } catch (err: any) {
            setSaveButton({text:'Save',disabled: false})
            toast.error(err.response.data.message || 'Something went wrong.')
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.top}>
                    <Input required label='Lane title' inputName='title'
                        error={errors.title?.message}
                        register={register} type='text' />

                    <div className={`${styles.publicity} ${!isPublic ? styles.toggled : ''}`}>
                        <button type='button' onClick={() => setIsPublic(true)} className={isPublic ? styles.active : ''}><TbWorld /> Public</button>
                        <button type='button' onClick={() => setIsPublic(false)} className={!isPublic ? styles.active : ''}><MdLockOutline /> Private</button>
                    </div>
                </div>
                <EditorProvider
                    onUpdate={({ editor }) => setContent(editor.getHTML())}
                    editorProps={{ attributes: { class: styles.tiptap } }}
                    slotBefore={<MenuBar />}
                    extensions={extensions} content={content} children={undefined}>
                </EditorProvider>
                <div className={styles.submitWrapper}>
                    <Button onClick={handleSubmit(onSubmit)} type='submit' disabled={saveButton.disabled} text={saveButton.text} />
                </div>
            </div>
        </>
    )
}

export default Create