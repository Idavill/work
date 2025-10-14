import BigCard from "./BigCard";
import type { ProjectType } from "../types/Types";

type ModalProps = {
  project: ProjectType;
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
};

export default function Modal({open, setOpen, project}:ModalProps) {
    return(
        <>
        {open && (
            <>
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="absolute z-10 modal-box">
                <BigCard project={project}/>
                </div>
                <form onClick={() => setOpen(false)}
                    method="dialog"
                    className="absolute w-full h-full modal-backdrop z-0">
                </form>
            </div>
            </>
            )}

        </>
    )
}