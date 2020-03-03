# require fileutils

path = "./"

counter = 35
# Dir.open(path).each do |p|
#   next if File.extname(p) != ".png"
#   filename = File.basename(p, File.extname(p))
#   newname =  'freddy_200-' + counter.to_s + File.extname(p)  
#   FileUtils.mv("#{path}/#{p}", "#{path}/#{newname}")
#   counter += 1
# end


Dir.open(path).sort().each do |p|
 next unless p.match(/freddy_200-...\.png/)
 old = path  + p
 new = path  + "freddy_200-#{counter}.png"
 File.rename(old, new)
 puts old + " => " + new
 counter += 1
end