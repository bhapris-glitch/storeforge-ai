/**
 * ============================================================================
 * StoreForge AI
 * useDashboard Hook
 * ============================================================================
 *
 * File:
 * frontend/src/hooks/useDashboard.ts
 *
 * Purpose:
 * - Provide a clean React interface for dashboard state
 * - Manage dashboard metrics
 * - Manage recent activity
 * - Track AI generation tasks
 * - Manage dashboard loading/refreshing/error state
 *
 * IMPORTANT:
 * - This hook does not call APIs directly.
 * - API operations belong in the appropriate service files.
 * - Backend remains the source of truth for dashboard data.
 * - This is SaaS/dashboard functionality only.
 * - No chatbot/customer-conversation functionality belongs here.
 *
 * ============================================================================
 */

'use client';

import { useCallback } from 'react';

import {
  useDashboardStore
} from '@/store';

import type {
  DashboardMetrics,
  DashboardActivity,
  AITaskStatus
} from '@/store';


// ============================================================================
// HOOK
// ============================================================================

export function useDashboard() {


  // ==========================================================================
  // STATE
  // ==========================================================================

  const metrics =
    useDashboardStore(
      (state) => state.metrics
    );


  const activities =
    useDashboardStore(
      (state) => state.activities
    );


  const aiTasks =
    useDashboardStore(
      (state) => state.aiTasks
    );


  const isLoading =
    useDashboardStore(
      (state) => state.isLoading
    );


  const isLoaded =
    useDashboardStore(
      (state) => state.isLoaded
    );


  const isRefreshing =
    useDashboardStore(
      (state) => state.isRefreshing
    );


  const error =
    useDashboardStore(
      (state) => state.error
    );


  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setMetrics =
    useDashboardStore(
      (state) => state.setMetrics
    );


  const updateMetrics =
    useDashboardStore(
      (state) => state.updateMetrics
    );


  const setActivities =
    useDashboardStore(
      (state) => state.setActivities
    );


  const addActivity =
    useDashboardStore(
      (state) => state.addActivity
    );


  const setAITasks =
    useDashboardStore(
      (state) => state.setAITasks
    );


  const addAITask =
    useDashboardStore(
      (state) => state.addAITask
    );


  const updateAITask =
    useDashboardStore(
      (state) => state.updateAITask
    );


  const removeAITask =
    useDashboardStore(
      (state) => state.removeAITask
    );


  const setLoading =
    useDashboardStore(
      (state) => state.setLoading
    );


  const setRefreshing =
    useDashboardStore(
      (state) => state.setRefreshing
    );


  const setLoaded =
    useDashboardStore(
      (state) => state.setLoaded
    );


  const setError =
    useDashboardStore(
      (state) => state.setError
    );


  const clearError =
    useDashboardStore(
      (state) => state.clearError
    );


  const reset =
    useDashboardStore(
      (state) => state.reset
    );


  // ==========================================================================
  // METRICS
  // ==========================================================================

  const handleSetMetrics =
    useCallback(
      (
        value: DashboardMetrics
      ) => {

        setMetrics(value);

      },
      [setMetrics]
    );


  const handleUpdateMetrics =
    useCallback(
      (
        updates: Partial<DashboardMetrics>
      ) => {

        updateMetrics(updates);

      },
      [updateMetrics]
    );


  // ==========================================================================
  // ACTIVITIES
  // ==========================================================================

  const handleSetActivities =
    useCallback(
      (
        value: DashboardActivity[]
      ) => {

        setActivities(value);

      },
      [setActivities]
    );


  const handleAddActivity =
    useCallback(
      (
        activity: DashboardActivity
      ) => {

        addActivity(activity);

      },
      [addActivity]
    );


  // ==========================================================================
  // AI TASKS
  // ==========================================================================

  const handleSetAITasks =
    useCallback(
      (
        tasks: AITaskStatus[]
      ) => {

        setAITasks(tasks);

      },
      [setAITasks]
    );


  const handleAddAITask =
    useCallback(
      (
        task: AITaskStatus
      ) => {

        addAITask(task);

      },
      [addAITask]
    );


  const handleUpdateAITask =
    useCallback(
      (
        taskId: string,
        updates: Partial<AITaskStatus>
      ) => {

        updateAITask(
          taskId,
          updates
        );

      },
      [updateAITask]
    );


  const handleRemoveAITask =
    useCallback(
      (
        taskId: string
      ) => {

        removeAITask(taskId);

      },
      [removeAITask]
    );


  // ==========================================================================
  // ERROR / RESET
  // ==========================================================================

  const handleClearError =
    useCallback(
      () => {

        clearError();

      },
      [clearError]
    );


  const handleReset =
    useCallback(
      () => {

        reset();

      },
      [reset]
    );


  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================

  const hasMetrics =
    metrics !== null;


  const hasActivities =
    activities.length > 0;


  const hasAITasks =
    aiTasks.length > 0;


  const activeAITasks =
    aiTasks.filter(
      (task) =>
        task.status === 'pending' ||
        task.status === 'processing'
    );


  const hasActiveAITasks =
    activeAITasks.length > 0;


  // ==========================================================================
  // RETURN
  // ==========================================================================

  return {


    // ------------------------------------------------------------------------
    // Dashboard data
    // ------------------------------------------------------------------------

    metrics,

    activities,

    aiTasks,


    // ------------------------------------------------------------------------
    // Derived data
    // ------------------------------------------------------------------------

    hasMetrics,

    hasActivities,

    hasAITasks,

    activeAITasks,

    hasActiveAITasks,


    // ------------------------------------------------------------------------
    // Loading state
    // ------------------------------------------------------------------------

    isLoading,

    isLoaded,

    isRefreshing,


    // ------------------------------------------------------------------------
    // Error
    // ------------------------------------------------------------------------

    error,


    // ------------------------------------------------------------------------
    // Metrics actions
    // ------------------------------------------------------------------------

    setMetrics:
      handleSetMetrics,

    updateMetrics:
      handleUpdateMetrics,


    // ------------------------------------------------------------------------
    // Activity actions
    // ------------------------------------------------------------------------

    setActivities:
      handleSetActivities,

    addActivity:
      handleAddActivity,


    // ------------------------------------------------------------------------
    // AI task actions
    // ------------------------------------------------------------------------

    setAITasks:
      handleSetAITasks,

    addAITask:
      handleAddAITask,

    updateAITask:
      handleUpdateAITask,

    removeAITask:
      handleRemoveAITask,


    // ------------------------------------------------------------------------
    // Loading actions
    // ------------------------------------------------------------------------

    setLoading,

    setRefreshing,

    setLoaded,


    // ------------------------------------------------------------------------
    // Error / reset
    // ------------------------------------------------------------------------

    setError,

    clearError:
      handleClearError,

    reset:
      handleReset

  };

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useDashboard;
