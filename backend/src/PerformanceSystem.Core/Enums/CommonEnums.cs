namespace PerformanceSystem.Core.Enums;

public enum EmployeeStatus
{
    Active = 1,
    OnLeave = 2,
    Terminated = 3
}

public enum GoalType
{
    Strategic = 1,
    Operational = 2,
    Development = 3
}

public enum GoalStatus
{
    Draft = 1,
    Approved = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5
}

public enum EvaluationType
{
    Annual = 1,
    MidYear = 2,
    Quarterly = 3
}

public enum EvaluationStatus
{
    Draft = 1,
    Submitted = 2,
    Approved = 3,
    Objected = 4
}

public enum PerformanceRating
{
    Excellent = 1,      // 4.5 - 5.0
    AboveExpected = 2,  // 3.5 - 4.49
    Satisfactory = 3,   // 2.5 - 3.49
    BelowExpected = 4,  // 1.5 - 2.49
    Poor = 5            // 0.0 - 1.49
}

public enum ObjectionStatus
{
    Open = 1,
    UnderReview = 2,
    Accepted = 3,
    Rejected = 4,
    Adjusted = 5
}

public enum PIPStatus
{
    Open = 1,
    InProgress = 2,
    Closed = 3,
    Extended = 4
}
