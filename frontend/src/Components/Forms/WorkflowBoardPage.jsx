import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './WorkflowBoardPage.css';

export const WorkflowBoard = () => {
  const { templateId } = useParams(); 
  const [stages, setStages] = useState([]);
  const [formInstances, setFormInstances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        const stagesResponse = await fetch(`http://localhost:3000/api/workflowStages/${templateId}`);
        if (!stagesResponse.ok) {
          throw new Error(`HTTP error fetching stages! Status: ${stagesResponse.status}`);
        }
        const stagesData = await stagesResponse.json();
        setStages(stagesData);

        const formInstancesResponse = await fetch(`http://localhost:3000/api/formInstances/${templateId}`);
        if (!formInstancesResponse.ok) {
          throw new Error(`HTTP error fetching form instances! Status: ${formInstancesResponse.status}`);
        }
        const formInstancesData = await formInstancesResponse.json();
        setFormInstances(formInstancesData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching workflow data:', error);
        setLoading(false);
      }
    };

    fetchWorkflowData();
  }, [templateId]);

  const createNewForm = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/formInstance/Instances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: templateId,
          submitted_by: 11, // replace with user id later
          pdf_file_path: `/uploads/forms/form_${Date.now()}.pdf`, // Placeholder for now 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newForm = await response.json();
      alert('New form created successfully!');
      console.log('New form instance:', newForm);

     
    } catch (error) {
      console.error('Error creating new form:', error);
      alert('Failed to create a new form.');
    }
  };

  return (
    <div className="workflow-board-container">
      {loading ? (
        <p>Loading workflow board...</p>
      ) : (
        <>
          <h1>Workflow Board</h1>
          <button onClick={createNewForm} className="create-form-button">
            Create New Form
          </button>
          <div className="stages-container">
            {stages.map((stage) => (
              <div key={stage.id} className="stage-card">
                <h3>{stage.stage_name}</h3>
                <div className="form-instances-list">
                  {formInstances
                    .filter((form) => form.status === stage.stage_name)
                    .map((form) => (
                      <div key={form.id} className="form-instance-card">
                        <p>Form {form.id}</p>
                        <p>Status: {form.status}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkflowBoard;
