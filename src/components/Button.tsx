
type ButtonProps = {
  key?:string;
  name: string;
  onClick?: Function;
};

export default function Button({ name }: ButtonProps) {

  return (
    <button className=" text-white rounded-3xl bg-transparent hover:border-transparent hover:bg-gray-900 hover:text-green-400  active:text-green-400 px-4 py-2">
      <h2>{name}</h2>
    </button>
  );
}
