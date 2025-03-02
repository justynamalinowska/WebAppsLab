import "./Project.Form.style.css"
import React, { useState } from "react";

type Props = {
    onBackBtnClickHnd: () => void;
}

const AddProject = (Props: Props) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { onBackBtnClickHnd } = Props;

    const onNameChangeHnd = (e : any) => {
        setName(e.target.value);
    }

    const onDescriptionChangeHnd = (e : any) => {
        setDescription(e.target.value);
    }

    return (
        <div className="form-container">
            <h2>Add Project</h2>
            <form>
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
                    <input type="button" value="Add Project" />
                </div>
            </form>
        </div>
    );
};

export default AddProject;