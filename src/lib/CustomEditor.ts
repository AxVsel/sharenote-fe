import ClassicEditorBase from "@ckeditor/ckeditor5-build-classic";
import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";

class CustomEditor extends ClassicEditorBase {}

// tambahkan plugin tambahan di sini kalau ada
CustomEditor.builtinPlugins = [...ClassicEditorBase.builtinPlugins];

(CustomEditor as any).defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "link",
      "bulletedList",
      "numberedList",
      "blockQuote",
      "|",
      "alignment",
      "insertTable",
      "imageUpload",
      "mediaEmbed",
      "|",
      "undo",
      "redo",
    ],
  },
  image: {
    toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
  },
  extraPlugins: [
    function (editor: any) {
      editor.plugins.get("FileRepository").createUploadAdapter = (
        loader: any
      ) => new Base64UploadAdapter(loader);
    },
  ],
};

export default CustomEditor;
