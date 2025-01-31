import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './WorkflowBoardPage.css';

export const WorkflowBoard = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [formInstances, setFormInstances] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        
        const stagesResponse = await fetch(`http://localhost:3000/api/workflowStages/${templateId}`);
        if (!stagesResponse.ok) {
          throw new Error(`Error fetching stages! Status: ${stagesResponse.status}`);
        }
        const stagesData = await stagesResponse.json();
        console.log("Fetched stages:", stagesData);
        setStages(stagesData);

        
        const formInstancesResponse = await fetch(`http://localhost:3000/api/formInstance/instances/${templateId}`);
        const formInstancesData = await formInstancesResponse.json();

        // Ensure formInstances is an array
        const instancesArray = Array.isArray(formInstancesData) ? formInstancesData : [formInstancesData];
        console.log("Fetched form instances (as array):", instancesArray);
        setFormInstances(instancesArray);
      } catch (error) {
        console.error('Error fetching workflow data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowData();
  }, [templateId]);

  const createNewForm = () => {
    navigate(`/form/${templateId}`);
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
                    ?.filter((form) => form.status === stage.stage_name)
                    .map((form) => (
                      <div key={form.id} className="form-instance-card">
                        <p>Form {form.id}</p>
                        <p>Status: {form.status}</p>
                        <button
                          onClick={() => navigate(`/formInstance/${form.id}`)}
                          className="view-form-button"
                        >
                          View/Edit
                        </button>
                      </div>
                    ))}
                  {formInstances?.filter((form) => form.status === stage.stage_name).length === 0 && (
                    <p>No forms in this stage.</p>
                  )}
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
