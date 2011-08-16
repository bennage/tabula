def run_all_tests
  print `clear`
  puts "Tests run #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}"
  puts `nodeunit ./specs`
end

ignore = ['public','node_modules','views']
dirs = Dir.glob('*/').map { |d| d.sub '/','' }.select { |d| !ignore.any? { |i| i == d }}.join('|')
pattern = '(' + dirs + ')(/.*)+.js'

run_all_tests

watch(pattern) { |m| run_all_tests }

@interrupted = false

# Ctrl-C
Signal.trap 'INT' do
  if @interrupted
    abort('\n')
  else
    puts 'Interrupt a second time to quit'
    @interrupted = true
    Kernel.sleep 1.5

    run_all_tests
    @interrupted = false
  end
end