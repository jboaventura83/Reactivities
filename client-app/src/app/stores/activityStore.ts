import { observable, action, makeObservable } from "mobx";
import { createContext } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined = undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;

  @action loadActivities = () => {
    this.loadingInitial = true;
    agent.Activities.list()
      .then((activities) => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activities.push(activity);
        });
      })
      .catch((error) => console.log(error))
      .finally(() => (this.loadingInitial = false));
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((a) => a.id === id);
    this.editMode = false;
  };

  @action createActivity = async (activity: IActivity) => {
      this.submitting = true;
      try {
          await agent.Activities.create(activity);
          this.activities.push(activity);
          this.editMode = false;
          this.submitting = false;
      } catch (error) {
          this.submitting = false;
          console.log(error);
      }
  };

  @action openCreateForm = () => {
      this.editMode = true;
      this.selectedActivity = undefined;
  }



  constructor() {
    makeObservable(this);
  }
}

export default createContext(new ActivityStore());
