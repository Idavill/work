
type ButtonProps = {
  key?:string;
  name: string;
  onClick?: Function;
};

export default function Button({ name }: ButtonProps) {

  return (
    <button className=" text-ink rounded-3xl bg-transparent hover:border-transparent hover:bg-surface hover:text-accent  active:text-accent px-4 py-2">
      <h2>{name}</h2>
    </button>
  );
}
