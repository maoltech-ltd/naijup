//Editor.jsx

'use client';
import EditorJS from "@editorjs/editorjs";
// import classes from '../styles/editorjs.module.css';
import { useEffect, useRef } from "react";
import { EDITOR_CONFIG } from "./config";

const Editors = ({ value, onChange, holder }: any) => {

    const ref: any = useRef();

    useEffect(() => {

        if (!ref.current) {
            const editor = new EditorJS({
                holder: holder,
                tools: EDITOR_CONFIG,
                placeholder: 'Write an Amazing Blog',
                data: value,
                async onChange(api, event) {
                    const data = await api.saver.save();
                    onChange(data);
                },
                i18n: {
                    toolNames: {
                        Hyperlink: 'Link'
                    },
                    tools: {
                        hyperlink: {
                            Save: 'Salvar',
                            'Select target': 'Seleziona destinazione',
                            'Select rel': 'Wählen rel'
                        }
                    }
                }
            })

            ref.current = editor;
        }

        return () => {
            if (ref.current && ref.current.destroy) {
                ref.current.destroy();
            }
        };
    }, []);


    return (
        <div id={holder} className={`py={4} border={'1px solid rgb(190, 195, 224, 0.4)'} borderRadius={6}`} />
    )
}


export default Editors;

// export const Editorsx = async() => {
//     const EditorJS = (await import("@editorjs/editorjs")).default;
//   const Header = (await import("@editorjs/header")).default;
//   const Table = (await import("@editorjs/table")).default;
//   const Embed = (await import("@editorjs/embed")).default;
//   const List = (await import("@editorjs/list")).default;
//   const Code = (await import("@editorjs/code")).default;
//   const LinkTool = (await import("@editorjs/link")).default;
//   const InlineCode = (await import("@editorjs/inline-code")).default;
//   const Quote = (await import("@editorjs/quote")).default;
//   const Raw = (await import("@editorjs/raw")).default;
//   const CheckList = (await import("@editorjs/checklist")).default;
//   return (
//     <div></div>
//   )
// }

