import mongoose from "mongoose";

const analyticsMetricsSchema = new mongoose.Schema({
    metricName: {
        type: String,
        required: true,
        enum: [
            'daily_active_users',
            'monthly_active_users',
            'average_session_duration',
            'component_usage',
            'goal_completion_rate',
            'investment_distribution',
            'user_retention'
        ]
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
});

// Index for faster retrieval
analyticsMetricsSchema.index({ metricName: 1, timestamp: -1 });

const AnalyticsMetrics = mongoose.model('AnalyticsMetrics', analyticsMetricsSchema);

export default AnalyticsMetrics;