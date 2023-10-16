import ModelForm, { ModelFormAttribute, ModelFormProps } from "./ModelForm";

export interface DetailViewProps extends ModelFormProps {

}

export interface DetailViewAttribute extends ModelFormAttribute {

}

export default function DetailView(props: DetailViewProps) {
  return (
    <ModelForm {...props} />
  );
}
