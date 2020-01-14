local config = {}

config.ProjectName = "xlsx exporter" ---@type string
config.BuildNumber = 10 ---@type number
config.Authors = { "Nef." } ---@type string[]
config.Dependencies = { "xlsx", "webpack", "typescript" } ---@type string[]

return config
