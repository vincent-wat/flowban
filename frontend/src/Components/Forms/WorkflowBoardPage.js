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
        if (formInstancesResponse.ok) {
          const formInstancesData = await formInstancesResponse.json();
          setFormInstances(formInstancesData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching workflow data:', error);
        setLoading(false);
      }
    };

    fetchWorkflowData();
  }, [templateId]);

  const getFormsByStage = (stageName) => {
    return formInstances.filter((instance) => instance.current_stage === stageName);
  };

  return (
    <div className="workflow-board-container">
      {loading ? (
        <p>Loading workflow board...</p>
      ) : (
        <>
          <h1>Workflow Board for Time Conflict Forms</h1>
          <div className="stages-container">
            {stages.map((stage) => (
              <div key={stage.id} className="stage-card">
                <h3>{stage.stage_name}</h3>
                <div className="form-instances-list">
                  {getFormsByStage(stage.stage_name).length > 0 ? (
                    getFormsByStage(stage.stage_name).map((form) => (
                      <div key={form.id} className="form-instance-card">
                        <p>Time Conflict Form {form.id}</p>
                        <p>Status: {form.status}</p>
                      </div>
                    ))
                  ) : (
                    <p>No forms in this stage</p>
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
