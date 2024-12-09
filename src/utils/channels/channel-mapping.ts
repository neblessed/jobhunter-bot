class ChannelMapping {
    baseChannels = ["myresume_ru", "jobGeeks", "theyseeku", "HR_Prime1"]
    qaChannels = [...this.baseChannels, 'qa_jobs'];
    aqaChannels = [...this.baseChannels, 'qa_jobs'];
    feDevChannels = [...this.baseChannels];
    beDevChannels = [...this.baseChannels];
}

export const channels = new ChannelMapping();