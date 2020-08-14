interface InputSetting {
  placeholder?: string;
  maxLength?: number;
}

export class TodoInputProps {
  public handleSubmit: (value: string) => void;

  public inputSetting?: InputSetting = {
    maxLength: 20,
    placeholder: '请输入todo',
  };
}
