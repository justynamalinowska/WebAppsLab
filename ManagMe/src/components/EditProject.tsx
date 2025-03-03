import { IProject } from "./Project.type";
import "./Project.Form.style.css";
import { useState } from "react";

type Props = {
    data: IProject;
    onBackBtnClickHnd: () => void;
    onUpdateClickHnd: (data: IProject) => void;
}

const EditProject = (props: Props) => {

    const {data, onBackBtnClickHnd, onUpdateClickHnd} = props;

        const [name, setName] = useState(data.name);
        const [description, setDescription] = useState(data.description);

        const onNameChangeHnd = (e : any) => {
            setName(e.target.value);
        }
    
        const onDescriptionChangeHnd = (e : any) => {
            setDescription(e.target.value);
        }

            const onSubmitBtnClickHnd = (e : any) => {
                e.preventDefault();
                const updatedData: IProject = {
                    id: data.id,
                    name: name,
                    description: description
                }
        
                onUpdateClickHnd(updatedData);
                onBackBtnClickHnd();
            }

    return (
        <div className="form-container">
            <h2>Edit Project</h2>
            <form onSubmit={onSubmitBtnClickHnd}>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={name} onChange={onNameChangeHnd}/>
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" name="description" value={description} onChange={onDescriptionChangeHnd}/>
                </div>
                <div className="add-project-buttons">
                    <input type="button" value="Back" onClick={onBackBtnClickHnd} />
                    <input type="submit" value="Update Project" />
                </div>
            </form>
        </div>
    );
};

export default EditProject;